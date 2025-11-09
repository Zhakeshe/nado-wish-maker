import { useState, useEffect } from "react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Trophy, Star, Target, Award, CheckCircle, XCircle, Sparkles } from "lucide-react";
import { ArchaeologyMap } from "@/components/game/ArchaeologyMap";
import { DraggableObject } from "@/components/game/DraggableObject";
import { archaeologicalObjects } from "@/data/archaeologicalObjects";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

const Game = () => {
  const [currentObjectIndex, setCurrentObjectIndex] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const { language } = useLanguage();

  const currentObject = archaeologicalObjects[currentObjectIndex];
  const accuracy = totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0;

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const checkAnswer = async () => {
    if (!selectedRegion) {
      toast({
        title: language === 'ru' ? "Выберите регион" : language === 'kz' ? "Өңірді таңдаңыз" : "Select a region",
        description: language === 'ru' ? "Пожалуйста, выберите регион на карте перед проверкой ответа" : 
                     language === 'kz' ? "Жауапты тексеру алдында картадан өңірді таңдаңыз" :
                     "Please select a region on the map before checking",
        variant: "destructive",
      });
      return;
    }

    const correct = selectedRegion === currentObject.region;
    setIsCorrect(correct);
    setShowResult(true);
    setTotalAttempts(prev => prev + 1);

    if (correct) {
      const points = currentObject.points;
      setScore(prev => prev + points);
      setCorrectAnswers(prev => prev + 1);

      // Save points to database if user is logged in
      if (user) {
        try {
          // Update profile points
          const { data: profile } = await supabase
            .from('profiles')
            .select('points')
            .eq('user_id', user.id)
            .single();

          if (profile) {
            await supabase
              .from('profiles')
              .update({ points: (profile.points || 0) + points })
              .eq('user_id', user.id);

            // Add to points history
            await supabase
              .from('points_history')
              .insert({
                user_id: user.id,
                points,
                action: 'game_correct_answer',
                description: `Правильный ответ: ${currentObject.name}`
              });
          }
        } catch (error) {
          console.error('Error updating points:', error);
        }
      }

      toast({
        title: language === 'ru' ? "Правильно!" : language === 'kz' ? "Дұрыс!" : "Correct!",
        description: language === 'ru' ? `Вы заработали ${points} поинтов знаний` :
                     language === 'kz' ? `Сіз ${points} білім ұпайын жинадыңыз` :
                     `You earned ${points} knowledge points`,
      });
    } else {
      toast({
        title: language === 'ru' ? "Неправильно" : language === 'kz' ? "Қате" : "Incorrect",
        description: language === 'ru' ? `Правильный регион: ${currentObject.region}` :
                     language === 'kz' ? `Дұрыс өңір: ${currentObject.region}` :
                     `Correct region: ${currentObject.region}`,
        variant: "destructive",
      });
    }
  };

  const nextQuestion = () => {
    if (currentObjectIndex < archaeologicalObjects.length - 1) {
      setCurrentObjectIndex(prev => prev + 1);
      setSelectedRegion("");
      setShowResult(false);
      setIsCorrect(false);
    } else {
      toast({
        title: language === 'ru' ? "Игра завершена!" : language === 'kz' ? "Ойын аяқталды!" : "Game completed!",
        description: language === 'ru' ? `Ваш итоговый счёт: ${score} поинтов` :
                     language === 'kz' ? `Сіздің жалпы ұпайыңыз: ${score}` :
                     `Your final score: ${score} points`,
      });
      setCurrentObjectIndex(0);
      setSelectedRegion("");
      setShowResult(false);
      setIsCorrect(false);
    }
  };

  const translations = {
    ru: {
      title: "Археологическая игра",
      subtitle: "Проверьте свои знания истории и географии Казахстана",
      points: "Поинты",
      level: "Уровень",
      accuracy: "Точность",
      achievements: "Достижения",
      dragObject: "Перетащите объект на правильный регион",
      selectRegion: "Выберите регион",
      check: "Проверить ответ",
      next: "Следующий объект",
      howToPlay: "Как играть:",
      step1: "Изучите археологический объект",
      step2: "Выберите правильный регион на карте",
      step3: "За правильный ответ получите поинты",
      step4: "Узнайте исторические факты после ответа",
    },
    kz: {
      title: "Археологиялық ойын",
      subtitle: "Қазақстанның тарихы мен географиясы бойынша білімді тексеріңіз",
      points: "Ұпай",
      level: "Деңгей",
      accuracy: "Дәлдік",
      achievements: "Жетістіктер",
      dragObject: "Нысанды дұрыс өңірге апарыңыз",
      selectRegion: "Өңірді таңдаңыз",
      check: "Жауапты тексеру",
      next: "Келесі нысан",
      howToPlay: "Қалай ойнау керек:",
      step1: "Археологиялық нысанды зерттеңіз",
      step2: "Картадан дұрыс өңірді таңдаңыз",
      step3: "Дұрыс жауап үшін ұпай алыңыз",
      step4: "Жауаптан кейін тарихи фактілерді біліңіз",
    },
    en: {
      title: "Archaeological Game",
      subtitle: "Test your knowledge of Kazakhstan's history and geography",
      points: "Points",
      level: "Level",
      accuracy: "Accuracy",
      achievements: "Achievements",
      dragObject: "Drag object to the correct region",
      selectRegion: "Select region",
      check: "Check answer",
      next: "Next object",
      howToPlay: "How to play:",
      step1: "Study the archaeological object",
      step2: "Select the correct region on the map",
      step3: "Get points for correct answer",
      step4: "Learn historical facts after answering",
    }
  };

  const t = translations[language];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        
        <main className="flex-1 pt-20">
          {/* Header */}
          <section className="py-16 bg-gradient-subtle">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-background rounded-full mb-6 border border-primary/20">
                  <Trophy className="w-4 h-4 text-primary fill-primary" />
                  <span className="text-sm font-medium">{t.title}</span>
                </div>
                
                <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
                  {t.subtitle}
                </h1>
              </div>
            </div>
          </section>

          {/* Game Stats */}
          <section className="py-8 border-b border-border">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <Card className="p-4 text-center gradient-card">
                  <Star className="w-6 h-6 text-primary mx-auto mb-2 fill-primary" />
                  <div className="text-2xl font-bold mb-1">{score}</div>
                  <div className="text-xs text-muted-foreground">{t.points}</div>
                </Card>
                
                <Card className="p-4 text-center gradient-card">
                  <Target className="w-6 h-6 text-secondary mx-auto mb-2" />
                  <div className="text-2xl font-bold mb-1">{currentObjectIndex + 1}</div>
                  <div className="text-xs text-muted-foreground">{t.level}</div>
                </Card>
                
                <Card className="p-4 text-center gradient-card">
                  <Trophy className="w-6 h-6 text-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold mb-1">{accuracy}%</div>
                  <div className="text-xs text-muted-foreground">{t.accuracy}</div>
                </Card>
                
                <Card className="p-4 text-center gradient-card">
                  <Award className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold mb-1">{correctAnswers}</div>
                  <div className="text-xs text-muted-foreground">{t.achievements}</div>
                </Card>
              </div>
            </div>
          </section>

          {/* Game Area */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Left Panel - Object */}
                  <div className="lg:col-span-1 space-y-6">
                    <Card className="p-6 gradient-card shadow-elegant border-2 border-primary/20">
                      <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                        {language === 'ru' ? 'Объект' : language === 'kz' ? 'Нысан' : 'Object'} {currentObjectIndex + 1}/{archaeologicalObjects.length}
                      </Badge>
                      
                      <DraggableObject object={currentObject} />
                      
                      {showResult && (
                        <div className={`mt-6 p-4 rounded-lg ${isCorrect ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'}`}>
                          <div className="flex items-center gap-2 mb-2">
                            {isCorrect ? (
                              <>
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="font-bold text-green-600">
                                  {language === 'ru' ? 'Правильно!' : language === 'kz' ? 'Дұрыс!' : 'Correct!'}
                                </span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-5 h-5 text-red-600" />
                                <span className="font-bold text-red-600">
                                  {language === 'ru' ? 'Неправильно' : language === 'kz' ? 'Қате' : 'Incorrect'}
                                </span>
                              </>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">
                            {language === 'ru' ? 'Правильный регион:' : language === 'kz' ? 'Дұрыс өңір:' : 'Correct region:'} <strong>{currentObject.region}</strong>
                          </p>
                          <Button onClick={nextQuestion} className="w-full">
                            {t.next}
                          </Button>
                        </div>
                      )}
                      
                      {!showResult && (
                        <div className="mt-6 space-y-3">
                          <Input
                            placeholder={t.selectRegion}
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value)}
                            className="text-sm"
                          />
                          <Button onClick={checkAnswer} className="w-full">
                            {t.check}
                          </Button>
                        </div>
                      )}
                    </Card>

                    {/* How to Play */}
                    <Card className="p-6 gradient-card">
                      <h3 className="font-bold text-lg mb-4">{t.howToPlay}</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-primary font-bold">1.</span>
                          {t.step1}
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary font-bold">2.</span>
                          {t.step2}
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary font-bold">3.</span>
                          {t.step3}
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary font-bold">4.</span>
                          {t.step4}
                        </li>
                      </ul>
                    </Card>
                  </div>

                  {/* Right Panel - Map */}
                  <div className="lg:col-span-2">
                    <Card className="p-2 gradient-card shadow-elegant" style={{ height: '700px' }}>
                      <ArchaeologyMap 
                        onRegionClick={setSelectedRegion}
                        highlightedRegion={selectedRegion}
                      />
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </DndProvider>
  );
};

export default Game;
