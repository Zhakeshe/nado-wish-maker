import { useState, useEffect, useMemo, useCallback } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Target, Award, CheckCircle, XCircle, Sparkles, MapPin, Clock, Play } from "lucide-react";
import { HistoricalFactModal } from "@/components/game/HistoricalFactModal";
import { archaeologicalObjects } from "@/data/archaeologicalObjects";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useLanguage } from "@/contexts/LanguageContext";
import MapboxMap from "@/components/MapboxMap";
import { buildRegionMarkers, resolveRegionId } from "@/utils/regionMarkers";

const GAME_TIME_SECONDS = 90; // 1.5 minutes

const Game = () => {
  const [currentObjectIndex, setCurrentObjectIndex] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedRegionId, setSelectedRegionId] = useState("");
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showHistoricalFact, setShowHistoricalFact] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME_SECONDS);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();

  const regionMarkers = useMemo(() => buildRegionMarkers(archaeologicalObjects), []);

  const currentObject = archaeologicalObjects[currentObjectIndex];
  const accuracy = totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0;

  useEffect(() => {
    checkUser();
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      toast({
        title: language === 'ru' ? "Время вышло!" : language === 'kz' ? "Уақыт бітті!" : "Time's up!",
        description: language === 'ru' ? `Ваш счёт: ${score}` : language === 'kz' ? `Сіздің ұпайыңыз: ${score}` : `Your score: ${score}`,
        variant: "destructive",
      });
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, score, language, toast]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const startGame = () => {
    setGameStarted(true);
    setTimeLeft(GAME_TIME_SECONDS);
    setIsTimerRunning(true);
    setScore(0);
    setCorrectAnswers(0);
    setTotalAttempts(0);
    setCurrentObjectIndex(0);
    setSelectedRegion("");
    setSelectedRegionId("");
    setShowResult(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

    const correct = selectedRegionId === resolveRegionId(currentObject.region);
    setIsCorrect(correct);
    setShowResult(true);
    setTotalAttempts(prev => prev + 1);

    if (correct) {
      const points = currentObject.points;
      setScore(prev => prev + points);
      setCorrectAnswers(prev => prev + 1);
      // Add 40 seconds for correct answer
      setTimeLeft(prev => prev + 40);

      if (user) {
        try {
          // Use secure RPC function to award points
          const { data, error } = await supabase.rpc('award_game_points', {
            action_type: 'game_correct_answer',
            description_text: `Правильный ответ: ${currentObject.name}`
          });

          if (error) {
            console.error('Error awarding points:', error);
          } else {
            console.log('Points awarded:', data);
          }
        } catch (error) {
          console.error('Error updating points:', error);
        }
      }

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

  const handleMarkerClick = useCallback((marker: any) => {
    setSelectedRegion(marker.label);
    setSelectedRegionId(marker.regionId);
    setShowResult(false);
    toast({
      title: marker.label,
      description: language === "kz" ? "Өңір таңдалды" : language === "ru" ? "Регион выбран" : "Region selected",
    });
  }, [language, toast]);

  const nextQuestion = () => {
    setShowHistoricalFact(false);
    if (currentObjectIndex < archaeologicalObjects.length - 1) {
      setCurrentObjectIndex(prev => prev + 1);
      setSelectedRegion("");
      setSelectedRegionId("");
      setShowResult(false);
      setIsCorrect(false);
    } else {
      setIsTimerRunning(false);
      toast({
        title: language === 'ru' ? "Игра завершена!" : language === 'kz' ? "Ойын аяқталды!" : "Game completed!",
        description: language === 'ru' ? `Ваш итоговый счёт: ${score} поинтов` :
                     language === 'kz' ? `Сіздің жалпы ұпайыңыз: ${score}` :
                     `Your final score: ${score} points`,
      });
      setGameStarted(false);
    }
  };

  const translations = {
    ru: {
      title: "Найти на карте",
      subtitle: "Найдите местоположение археологического объекта на карте Казахстана",
      points: "Поинты",
      level: "Уровень",
      accuracy: "Точность",
      achievements: "Достижения",
      selectRegion: "Выберите регион",
      check: "Проверить ответ",
      next: "Следующий объект",
      howToPlay: "Как играть:",
      step1: "Изучите археологический объект",
      step2: "Найдите его местоположение на карте",
      step3: "За правильный ответ получите поинты",
      step4: "Узнайте исторические факты после ответа",
      startGame: "Начать игру",
      timeLeft: "Осталось времени",
      findLocation: "Найдите местоположение объекта на карте",
    },
    kz: {
      title: "Картадан табу",
      subtitle: "Қазақстан картасынан археологиялық объектінің орнын табыңыз",
      points: "Ұпай",
      level: "Деңгей",
      accuracy: "Дәлдік",
      achievements: "Жетістіктер",
      selectRegion: "Өңірді таңдаңыз",
      check: "Жауапты тексеру",
      next: "Келесі нысан",
      howToPlay: "Қалай ойнау керек:",
      step1: "Археологиялық нысанды зерттеңіз",
      step2: "Картадан орналасқан жерін табыңыз",
      step3: "Дұрыс жауап үшін ұпай алыңыз",
      step4: "Жауаптан кейін тарихи фактілерді біліңіз",
      startGame: "Бастау",
      timeLeft: "Қалған уақыт",
      findLocation: "Картадан объектінің орнын табыңыз",
    },
    en: {
      title: "Find on Map",
      subtitle: "Find the location of the archaeological object on the map of Kazakhstan",
      points: "Points",
      level: "Level",
      accuracy: "Accuracy",
      achievements: "Achievements",
      selectRegion: "Select region",
      check: "Check answer",
      next: "Next object",
      howToPlay: "How to play:",
      step1: "Study the archaeological object",
      step2: "Find its location on the map",
      step3: "Get points for correct answer",
      step4: "Learn historical facts after answering",
      startGame: "Start Game",
      timeLeft: "Time left",
      findLocation: "Find the object's location on the map",
    }
  };

  const t = translations[language];

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-sand">
        <Navigation />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <Card className="max-w-lg w-full mx-4 p-8 text-center gradient-archaeology shadow-elegant">
            <div className="mb-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-10 h-10 text-primary" />
              </div>
              <h1 className="font-serif text-3xl font-bold mb-2">{t.title}</h1>
              <p className="text-muted-foreground">{t.subtitle}</p>
            </div>

            <div className="bg-muted/30 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold mb-3">{t.howToPlay}</h3>
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
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
              <Clock className="w-4 h-4" />
              <span>{t.timeLeft}: {formatTime(GAME_TIME_SECONDS)}</span>
            </div>

            <Button onClick={startGame} size="lg" className="w-full gap-2">
              <Play className="w-5 h-5" />
              {t.startGame}
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-sand">
      <Navigation />
      
      {showHistoricalFact && (
        <HistoricalFactModal
          object={currentObject}
          onClose={() => setShowHistoricalFact(false)}
          language={language}
        />
      )}
        
      <main className="flex-1 pt-20">
        {/* Header with Timer */}
        <section className="py-8 bg-gradient-archaeology">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-background rounded-full mb-4 border border-primary/20">
                <Trophy className="w-4 h-4 text-primary fill-primary" />
                <span className="text-sm font-medium">{t.title}</span>
              </div>
              
              {/* Timer */}
              <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${
                timeLeft <= 30 ? 'bg-red-100 text-red-700 border-red-300' : 'bg-primary/10 text-primary border-primary/20'
              } border`}>
                <Clock className="w-5 h-5" />
                <span className="text-2xl font-bold font-mono">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Game Stats */}
        <section className="py-4 border-y border-primary/10 bg-background/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-4 gap-3 max-w-2xl mx-auto">
              <Card className="p-3 text-center gradient-archaeology">
                <Star className="w-5 h-5 text-primary mx-auto mb-1 fill-primary" />
                <div className="text-xl font-bold">{score}</div>
                <div className="text-xs text-muted-foreground">{t.points}</div>
              </Card>
              <Card className="p-3 text-center gradient-archaeology">
                <Target className="w-5 h-5 text-secondary mx-auto mb-1" />
                <div className="text-xl font-bold">{currentObjectIndex + 1}/{archaeologicalObjects.length}</div>
                <div className="text-xs text-muted-foreground">{t.level}</div>
              </Card>
              <Card className="p-3 text-center gradient-archaeology">
                <Trophy className="w-5 h-5 text-accent mx-auto mb-1" />
                <div className="text-xl font-bold">{accuracy}%</div>
                <div className="text-xs text-muted-foreground">{t.accuracy}</div>
              </Card>
              <Card className="p-3 text-center gradient-archaeology">
                <Award className="w-5 h-5 text-primary mx-auto mb-1" />
                <div className="text-xl font-bold">{correctAnswers}</div>
                <div className="text-xs text-muted-foreground">{t.achievements}</div>
              </Card>
            </div>
          </div>
        </section>

        {/* Game Area */}
        <section className="py-6">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
              {/* Object Card */}
              <Card className="p-5 gradient-archaeology shadow-elegant border-2 border-primary/30">
                <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 text-xs">
                  {language === 'ru' ? 'Объект' : language === 'kz' ? 'Нысан' : 'Object'} {currentObjectIndex + 1}
                </Badge>
                
                <div className="p-4 rounded-lg mb-4 bg-gradient-to-br from-amber-50 to-white border-2 border-primary/20">
                  <h3 className="font-serif text-lg font-bold mb-2 text-foreground">
                    {currentObject.name}
                  </h3>
                  
                  <Badge className="mb-2 text-xs">
                    {currentObject.era}
                  </Badge>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    {currentObject.description}
                  </p>
                  
                  <div className="flex items-center justify-between bg-primary/5 p-2 rounded">
                    <span className="text-xs text-muted-foreground">{t.findLocation}</span>
                    <span className="text-sm font-bold text-primary flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      +{currentObject.points}
                    </span>
                  </div>
                </div>

                {/* Selected region display */}
                {selectedRegion && (
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 mb-4">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      {selectedRegion}
                    </p>
                  </div>
                )}
                
                {showResult && (
                  <div className={`p-4 rounded-lg mb-4 ${
                    isCorrect 
                      ? 'bg-green-50 border-2 border-green-500' 
                      : 'bg-red-50 border-2 border-red-500'
                  }`}>
                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span className={`font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                        {isCorrect 
                          ? (language === 'ru' ? 'Правильно!' : language === 'kz' ? 'Дұрыс!' : 'Correct!')
                          : (language === 'ru' ? 'Неправильно' : language === 'kz' ? 'Қате' : 'Incorrect')
                        }
                      </span>
                    </div>
                    {!isCorrect && (
                      <p className="text-sm mt-2 text-red-600">
                        {language === 'ru' ? 'Правильный ответ:' : language === 'kz' ? 'Дұрыс жауап:' : 'Correct answer:'} {currentObject.region}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    onClick={checkAnswer} 
                    className="flex-1"
                    disabled={!selectedRegion || showResult}
                  >
                    {t.check}
                  </Button>
                  {showResult && (
                    <Button onClick={nextQuestion} variant="outline">
                      {t.next}
                    </Button>
                  )}
                </div>
              </Card>

              {/* Mapbox Map */}
              <div className="lg:col-span-2">
                <Card className="p-4 gradient-archaeology shadow-elegant border-2 border-primary/30">
                  <MapboxMap 
                    markers={regionMarkers}
                    onMarkerClick={handleMarkerClick}
                    language={language}
                    gameMode={true}
                  />
                </Card>
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
