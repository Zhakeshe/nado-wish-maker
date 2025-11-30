import { useState, useEffect, useMemo } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Trophy, Star, Target, Award, CheckCircle, XCircle, Sparkles, MapPin } from "lucide-react";
import { HistoricalFactModal } from "@/components/game/HistoricalFactModal";
import { archaeologicalObjects } from "@/data/archaeologicalObjects";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useLanguage } from "@/contexts/LanguageContext";
import KazakhstanMap from "@/components/KazakhstanMap";
import { buildRegionMarkers, resolveRegionId } from "@/utils/regionMarkers";

const Game = () => {
  const [currentObjectIndex, setCurrentObjectIndex] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showHistoricalFact, setShowHistoricalFact] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();

  const regionMarkers = useMemo(() => buildRegionMarkers(archaeologicalObjects), []);

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

    const correct = selectedRegion === resolveRegionId(currentObject.region);
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

      // Show historical fact modal after correct answer
      setTimeout(() => {
        setShowHistoricalFact(true);
      }, 1500);

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

  const handleSelectRegion = (regionName: string) => {
    setSelectedRegion(regionName);
    setShowResult(false);
  };

  const nextQuestion = () => {
    setShowHistoricalFact(false);
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
      mapTitle: "Авторская карта Казахстана",
      mapSubtitle: "Маркерлер біздің өз картамызда орналасқан, Mapbox немесе Google карта емес",
      mapFootnote: "Нажмите на точку региона или выберите его вручную ниже",
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
      mapTitle: "Қазақстанның авторлық картасы",
      mapSubtitle: "Маркерлерді өзіміз салған картада орналастырдық, Mapbox не Google картасы емес",
      mapFootnote: "Өңірді картадан басыңыз немесе төменге қолмен енгізіңіз",
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
      mapTitle: "Original map of Kazakhstan",
      mapSubtitle: "Markers are placed on our own map instead of Mapbox or Google embeds",
      mapFootnote: "Tap a region marker or enter it manually below",
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-sand">
      <Navigation />
      
      {/* Historical Fact Modal */}
      {showHistoricalFact && (
        <HistoricalFactModal
          object={currentObject}
          onClose={() => setShowHistoricalFact(false)}
          language={language}
        />
      )}
        
      <main className="flex-1 pt-20">
        {/* Header */}
        <section className="py-12 md:py-16 bg-gradient-archaeology">
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

          {/* Kazakhstan Map */}
          <section className="py-6 md:py-8 bg-gradient-sand">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <Card className="p-4 md:p-6 gradient-archaeology shadow-elegant border-2 border-primary/30">
                  <KazakhstanMap
                    markers={regionMarkers}
                    selectedRegion={selectedRegion}
                    onRegionSelect={handleSelectRegion}
                    onMarkerClick={(marker) => {
                      setShowResult(false);
                      toast({
                        title: marker.label,
                        description: language === "kz" ? "Өңір таңдалды" : language === "ru" ? "Регион выбран" : "Region selected",
                      });
                    }}
                    heading={t.mapTitle}
                    subheading={`${t.mapSubtitle} · Mapbox-free`}
                    legendNote={t.mapFootnote}
                  />
                  <div className="mt-4 text-center">
                    <p className="text-xs text-muted-foreground italic flex items-center gap-2 justify-center">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{t.mapFootnote}</span>
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </section>

          {/* Game Stats */}
          <section className="py-6 md:py-8 border-y border-primary/10 bg-background/50">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto">
                <Card className="p-4 md:p-6 text-center gradient-archaeology shadow-soft hover:shadow-gold transition-all hover:scale-105">
                  <div className="relative">
                    <Star className="w-7 h-7 md:w-8 md:h-8 text-primary mx-auto mb-2 fill-primary animate-pulse-gold" />
                    <Sparkles className="w-3 h-3 text-primary/50 absolute top-0 right-1/4" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold mb-1 bg-gradient-bronze bg-clip-text text-transparent">{score}</div>
                  <div className="text-xs text-muted-foreground font-medium">{t.points}</div>
                </Card>
                
                <Card className="p-4 md:p-6 text-center gradient-archaeology shadow-soft hover:shadow-gold transition-all hover:scale-105">
                  <Target className="w-7 h-7 md:w-8 md:h-8 text-secondary mx-auto mb-2" />
                  <div className="text-2xl md:text-3xl font-bold mb-1">{currentObjectIndex + 1}/{archaeologicalObjects.length}</div>
                  <div className="text-xs text-muted-foreground font-medium">{t.level}</div>
                </Card>
                
                <Card className="p-4 md:p-6 text-center gradient-archaeology shadow-soft hover:shadow-gold transition-all hover:scale-105">
                  <Trophy className="w-7 h-7 md:w-8 md:h-8 text-accent mx-auto mb-2" />
                  <div className="text-2xl md:text-3xl font-bold mb-1">{accuracy}%</div>
                  <div className="text-xs text-muted-foreground font-medium">{t.accuracy}</div>
                </Card>
                
                <Card className="p-4 md:p-6 text-center gradient-archaeology shadow-soft hover:shadow-gold transition-all hover:scale-105">
                  <Award className="w-7 h-7 md:w-8 md:h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl md:text-3xl font-bold mb-1">{correctAnswers}</div>
                  <div className="text-xs text-muted-foreground font-medium">{t.achievements}</div>
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
                  <div className="lg:col-span-1 space-y-4 md:space-y-6">
                    <Card className="p-4 md:p-6 gradient-archaeology shadow-elegant border-2 border-primary/30 hover:shadow-gold transition-all">
                      <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 text-xs">
                        {language === 'ru' ? 'Объект' : language === 'kz' ? 'Нысан' : 'Object'} {currentObjectIndex + 1}/{archaeologicalObjects.length}
                      </Badge>
                      
                      {/* Object Details */}
                      <div className="p-4 md:p-5 rounded-lg mb-4 parchment-texture relative overflow-hidden" style={{
                        border: '2px solid #D4A574',
                        background: 'linear-gradient(135deg, rgba(245, 239, 230, 0.95) 0%, rgba(255, 255, 255, 0.95) 100%)',
                      }}>
                        {/* Decorative corner */}
                        <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
                          <MapPin className="w-full h-full text-primary" />
                        </div>
                        
                        <h3 className="font-serif text-lg md:text-xl font-bold mb-3 text-foreground relative">
                          {currentObject.name}
                        </h3>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                            {currentObject.era}
                          </span>
                        </div>
                        
                        <p className="text-muted-foreground text-xs md:text-sm leading-relaxed mb-4">
                          {currentObject.description}
                        </p>
                        
                        <div className="pt-3 border-t-2 border-primary/20">
                          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                            <MapPin className="w-3 h-3" />
                            {language === 'ru' ? 'Выберите регион на карте' : language === 'kz' ? 'Картадан өңірді таңдаңыз' : 'Select region on map'}
                          </p>
                          <div className="flex items-center justify-between bg-gradient-bronze/10 p-2 rounded">
                            <span className="text-xs text-muted-foreground">
                              {language === 'ru' ? 'За правильный ответ:' : language === 'kz' ? 'Дұрыс жауап үшін:' : 'For correct answer:'}
                            </span>
                            <span className="text-sm font-bold text-primary flex items-center gap-1">
                              <Sparkles className="w-4 h-4" />
                              +{currentObject.points}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {showResult && (
                        <div className={`mt-4 md:mt-6 p-4 md:p-5 rounded-lg animate-scale-in ${
                          isCorrect 
                            ? 'bg-green-50 dark:bg-green-950/30 border-2 border-green-500' 
                            : 'bg-red-50 dark:bg-red-950/30 border-2 border-red-500'
                        }`}>
                          <div className="flex items-center gap-2 mb-3">
                            {isCorrect ? (
                              <>
                                <CheckCircle className="w-6 h-6 text-green-600 animate-scale-in" />
                                <span className="font-bold text-green-600 text-base md:text-lg">
                                  {language === 'ru' ? 'Правильно!' : language === 'kz' ? 'Дұрыс!' : 'Correct!'}
                                </span>
                                <Sparkles className="w-5 h-5 text-green-500 ml-auto" />
                              </>
                            ) : (
                              <>
                                <XCircle className="w-6 h-6 text-red-600" />
                                <span className="font-bold text-red-600 text-base md:text-lg">
                                  {language === 'ru' ? 'Неправильно' : language === 'kz' ? 'Қате' : 'Incorrect'}
                                </span>
                              </>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">
                            {language === 'ru' ? 'Правильный регион:' : language === 'kz' ? 'Дұрыс өңір:' : 'Correct region:'} <strong className="text-foreground">{currentObject.region}</strong>
                          </p>
                          <Button onClick={nextQuestion} className="w-full" size="lg">
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
                    <Card className="p-4 md:p-6 gradient-archaeology shadow-soft border border-primary/20">
                      <h3 className="font-bold text-base md:text-lg mb-4 text-primary">{t.howToPlay}</h3>
                      <ul className="space-y-3 text-xs md:text-sm text-muted-foreground">
                        <li className="flex items-start gap-3 p-2 rounded hover:bg-muted/30 transition-colors">
                          <span className="text-primary font-bold text-base">1.</span>
                          <span className="leading-relaxed">{t.step1}</span>
                        </li>
                        <li className="flex items-start gap-3 p-2 rounded hover:bg-muted/30 transition-colors">
                          <span className="text-primary font-bold text-base">2.</span>
                          <span className="leading-relaxed">{t.step2}</span>
                        </li>
                        <li className="flex items-start gap-3 p-2 rounded hover:bg-muted/30 transition-colors">
                          <span className="text-primary font-bold text-base">3.</span>
                          <span className="leading-relaxed">{t.step3}</span>
                        </li>
                        <li className="flex items-start gap-3 p-2 rounded hover:bg-muted/30 transition-colors">
                          <span className="text-primary font-bold text-base">4.</span>
                          <span className="leading-relaxed">{t.step4}</span>
                        </li>
                      </ul>
                    </Card>
                  </div>

                  {/* Right Panel - Interactive Game Area */}
                  <div className="lg:col-span-2">
                    <Card className="p-4 md:p-6 gradient-archaeology shadow-elegant border-2 border-primary/30">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-serif text-lg md:text-xl font-bold flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-primary" />
                          {language === 'ru' ? 'Игровая зона' : language === 'kz' ? 'Ойын аймағы' : 'Game Zone'}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {language === 'ru' ? 'Интерактивно' : language === 'kz' ? 'Интерактивті' : 'Interactive'}
                        </Badge>
                      </div>
                      
                      {/* Interactive area placeholder */}
                      <div className="parchment-texture rounded-lg p-8 md:p-12 min-h-[400px] md:min-h-[600px] flex flex-col items-center justify-center border-2 border-primary/20">
                        <div className="text-center space-y-4 max-w-md">
                          <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center animate-pulse-gold">
                            <MapPin className="w-10 h-10 text-primary" />
                          </div>
                          <h4 className="font-serif text-xl md:text-2xl font-bold text-primary">
                            {language === 'ru' ? 'Исследуйте древности' : language === 'kz' ? 'Ежелгі заттарды зерттеңіз' : 'Explore Ancient Artifacts'}
                          </h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {language === 'ru' 
                              ? 'Введите название региона Казахстана в поле ниже, чтобы указать, где был найден археологический объект' 
                              : language === 'kz'
                              ? 'Археологиялық нысан табылған жерді көрсету үшін төмендегі өріске Қазақстан өңірінің атын енгізіңіз'
                              : 'Enter the name of the Kazakhstan region below to indicate where the archaeological object was found'}
                          </p>
                          <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span>{language === 'ru' ? 'Используйте карту для подсказки' : language === 'kz' ? 'Кеңес үшін картаны пайдаланыңыз' : 'Use the map for hints'}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
  );
};

export default Game;
