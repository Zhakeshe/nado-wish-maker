import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Clock, RotateCcw, Play, History, ArrowDown, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface HistoricalEvent {
  id: number;
  year: number;
  event: string;
  eventKz: string;
  eventEn: string;
}

const historicalEvents: HistoricalEvent[] = [
  { id: 1, year: -1000, event: "Эпоха ранних кочевников (саки)", eventKz: "Ерте көшпенділер дәуірі (сақтар)", eventEn: "Early Nomads Era (Saka)" },
  { id: 2, year: -500, event: "Золотой человек (Иссыкский курган)", eventKz: "Алтын адам (Есік қорғаны)", eventEn: "Golden Man (Issyk Kurgan)" },
  { id: 3, year: 552, event: "Создание Тюркского каганата", eventKz: "Түрік қағанатының құрылуы", eventEn: "Formation of Turkic Khaganate" },
  { id: 4, year: 1219, event: "Монгольское нашествие", eventKz: "Моңғол шапқыншылығы", eventEn: "Mongol Invasion" },
  { id: 5, year: 1465, event: "Образование Казахского ханства", eventKz: "Қазақ хандығының құрылуы", eventEn: "Formation of Kazakh Khanate" },
  { id: 6, year: 1718, event: "Годы Великого бедствия (Ақтабан шұбырынды)", eventKz: "Ақтабан шұбырынды жылдары", eventEn: "Years of Great Disaster" },
  { id: 7, year: 1847, event: "Восстание Кенесары Касымова", eventKz: "Кенесары Қасымұлы көтерілісі", eventEn: "Kenesary Kasymov Uprising" },
  { id: 8, year: 1991, event: "Независимость Казахстана", eventKz: "Қазақстан тәуелсіздігі", eventEn: "Independence of Kazakhstan" },
];

const TimelineGame = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [events, setEvents] = useState<HistoricalEvent[]>([]);
  const [userOrder, setUserOrder] = useState<HistoricalEvent[]>([]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();

  const translations = {
    ru: {
      title: "Хронология",
      subtitle: "Расставьте исторические события в правильном порядке",
      startGame: "Начать игру",
      restart: "Начать заново",
      level: "Уровень",
      score: "Очки",
      check: "Проверить",
      next: "Следующий уровень",
      correct: "Правильно!",
      incorrect: "Неправильно!",
      tryAgain: "Попробуйте снова",
      howToPlay: "Как играть:",
      step1: "Нажмите на событие, чтобы добавить в хронологию",
      step2: "Расставьте события от раннего к позднему",
      step3: "Проверьте правильность порядка",
      step4: "Зарабатывайте очки за правильные ответы",
      clickToAdd: "Нажмите на событие, чтобы добавить",
      yourTimeline: "Ваша хронология:",
      eventsToSort: "События для сортировки:",
      victory: "Отлично! Вы прошли все уровни!",
    },
    kz: {
      title: "Хронология",
      subtitle: "Тарихи оқиғаларды дұрыс ретпен орналастырыңыз",
      startGame: "Ойынды бастау",
      restart: "Қайта бастау",
      level: "Деңгей",
      score: "Ұпай",
      check: "Тексеру",
      next: "Келесі деңгей",
      correct: "Дұрыс!",
      incorrect: "Қате!",
      tryAgain: "Қайтадан көріңіз",
      howToPlay: "Қалай ойнау:",
      step1: "Хронологияға қосу үшін оқиғаны басыңыз",
      step2: "Оқиғаларды ертеден кешке қарай реттеңіз",
      step3: "Реттің дұрыстығын тексеріңіз",
      step4: "Дұрыс жауаптар үшін ұпай жинаңыз",
      clickToAdd: "Қосу үшін оқиғаны басыңыз",
      yourTimeline: "Сіздің хронологияңыз:",
      eventsToSort: "Сұрыптайтын оқиғалар:",
      victory: "Керемет! Сіз барлық деңгейлерден өттіңіз!",
    },
    en: {
      title: "Timeline",
      subtitle: "Arrange historical events in correct order",
      startGame: "Start Game",
      restart: "Restart",
      level: "Level",
      score: "Score",
      check: "Check",
      next: "Next Level",
      correct: "Correct!",
      incorrect: "Incorrect!",
      tryAgain: "Try again",
      howToPlay: "How to play:",
      step1: "Click an event to add it to timeline",
      step2: "Arrange events from earliest to latest",
      step3: "Check if the order is correct",
      step4: "Earn points for correct answers",
      clickToAdd: "Click an event to add",
      yourTimeline: "Your timeline:",
      eventsToSort: "Events to sort:",
      victory: "Excellent! You completed all levels!",
    },
  };

  const t = translations[language];

  const getEventText = (event: HistoricalEvent) => {
    if (language === 'kz') return event.eventKz;
    if (language === 'en') return event.eventEn;
    return event.event;
  };

  const initializeLevel = (level: number) => {
    const eventsCount = Math.min(3 + level, 8);
    const shuffled = [...historicalEvents]
      .sort(() => Math.random() - 0.5)
      .slice(0, eventsCount);
    setEvents(shuffled);
    setUserOrder([]);
    setShowResult(false);
  };

  const startGame = () => {
    setGameStarted(true);
    setCurrentLevel(1);
    setScore(0);
    initializeLevel(1);
  };

  const addToTimeline = (event: HistoricalEvent) => {
    if (userOrder.find(e => e.id === event.id)) return;
    setUserOrder([...userOrder, event]);
  };

  const removeFromTimeline = (event: HistoricalEvent) => {
    setUserOrder(userOrder.filter(e => e.id !== event.id));
  };

  const checkOrder = async () => {
    const correctOrder = [...userOrder].sort((a, b) => a.year - b.year);
    const isOrderCorrect = userOrder.every((event, index) => event.id === correctOrder[index].id);
    
    setIsCorrect(isOrderCorrect);
    setShowResult(true);

    if (isOrderCorrect) {
      const points = userOrder.length * 15;
      setScore(prev => prev + points);
      
      toast({
        title: t.correct,
        description: `+${points} ${t.score}`,
      });

      // Award points
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.rpc('award_game_points', {
          action_type: 'timeline_correct_answer',
          description_text: `Хронология дұрыс жауап: ${currentLevel} деңгей`
        });
      }
    } else {
      toast({
        title: t.incorrect,
        description: t.tryAgain,
        variant: "destructive",
      });
    }
  };

  const nextLevel = () => {
    if (currentLevel >= 5) {
      toast({
        title: t.victory,
      });
      setGameStarted(false);
    } else {
      setCurrentLevel(prev => prev + 1);
      initializeLevel(currentLevel + 1);
    }
  };

  const formatYear = (year: number) => {
    if (year < 0) {
      return language === 'en' ? `${Math.abs(year)} BC` : `б.з.д. ${Math.abs(year)}`;
    }
    return `${year}`;
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-sand">
        <Navigation />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <Card className="max-w-lg w-full mx-4 p-8 text-center gradient-archaeology shadow-elegant">
            <div className="mb-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <History className="w-10 h-10 text-primary" />
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

  const remainingEvents = events.filter(e => !userOrder.find(u => u.id === e.id));

  return (
    <div className="min-h-screen flex flex-col bg-gradient-sand">
      <Navigation />
      <main className="flex-1 pt-20">
        {/* Header */}
        <section className="py-4 bg-gradient-archaeology">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Badge className="text-lg px-4 py-2">
                {t.level}: {currentLevel}/5
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2 gap-2">
                <Star className="w-4 h-4" />
                {score} {t.score}
              </Badge>
              <Button variant="outline" size="sm" onClick={startGame} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                {t.restart}
              </Button>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4 max-w-2xl">
            {/* Events to sort */}
            <div className="mb-8">
              <h3 className="font-semibold mb-4 text-center">{t.eventsToSort}</h3>
              <div className="space-y-2">
                {remainingEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => addToTimeline(event)}
                    className="w-full p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors text-left"
                  >
                    <span className="font-medium">{getEventText(event)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* User timeline */}
            <div className="mb-8">
              <h3 className="font-semibold mb-4 text-center">{t.yourTimeline}</h3>
              {userOrder.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">{t.clickToAdd}</p>
              ) : (
                <div className="space-y-2">
                  {userOrder.map((event, index) => (
                    <div key={event.id} className="flex items-center gap-2">
                      <div className="flex-1 p-4 bg-primary/10 rounded-lg border-2 border-primary/30 flex items-center justify-between">
                        <div>
                          <Badge className="mb-1">{formatYear(event.year)}</Badge>
                          <p className="font-medium">{getEventText(event)}</p>
                        </div>
                        <button
                          onClick={() => removeFromTimeline(event)}
                          className="p-2 hover:bg-red-100 rounded-full"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                      {index < userOrder.length - 1 && (
                        <ArrowDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              {!showResult && userOrder.length === events.length && (
                <Button onClick={checkOrder} size="lg" className="gap-2">
                  <Check className="w-5 h-5" />
                  {t.check}
                </Button>
              )}
              {showResult && isCorrect && (
                <Button onClick={nextLevel} size="lg" className="gap-2">
                  {t.next}
                </Button>
              )}
              {showResult && !isCorrect && (
                <Button onClick={() => {
                  setUserOrder([]);
                  setShowResult(false);
                }} variant="outline" size="lg">
                  {t.tryAgain}
                </Button>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TimelineGame;
