import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Clock, RotateCcw, Play, Layers } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const GAME_TIME = 180; // 3 minutes

const memoryItems = [
  { id: 1, name: "Алтын адам", nameKz: "Алтын адам", nameEn: "Golden Man", emoji: "👑" },
  { id: 2, name: "Балбал тас", nameKz: "Балбал тас", nameEn: "Balbal Stone", emoji: "🗿" },
  { id: 3, name: "Юрта", nameKz: "Киіз үй", nameEn: "Yurt", emoji: "⛺" },
  { id: 4, name: "Домбра", nameKz: "Домбыра", nameEn: "Dombra", emoji: "🎸" },
  { id: 5, name: "Мавзолей", nameKz: "Кесене", nameEn: "Mausoleum", emoji: "🕌" },
  { id: 6, name: "Петроглиф", nameKz: "Петроглиф", nameEn: "Petroglyph", emoji: "🪨" },
  { id: 7, name: "Кинжал", nameKz: "Қанжар", nameEn: "Dagger", emoji: "🗡️" },
  { id: 8, name: "Керамика", nameKz: "Керамика", nameEn: "Ceramics", emoji: "🏺" },
];

interface CardType {
  id: number;
  itemId: number;
  emoji: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryGame = () => {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [score, setScore] = useState(0);
  const { toast } = useToast();
  const { language } = useLanguage();

  const translations = {
    ru: {
      title: "Игра Память",
      subtitle: "Найдите пары карточек с историческими объектами",
      startGame: "Начать игру",
      restart: "Начать заново",
      moves: "Ходы",
      pairs: "Пары",
      timeLeft: "Время",
      score: "Очки",
      howToPlay: "Как играть:",
      step1: "Нажмите на карточку, чтобы перевернуть",
      step2: "Найдите две одинаковые карточки",
      step3: "Запоминайте расположение карточек",
      step4: "Найдите все пары до истечения времени",
      gameOver: "Время вышло!",
      victory: "Победа!",
      foundAll: "Вы нашли все пары!",
    },
    kz: {
      title: "Жады ойыны",
      subtitle: "Тарихи объектілері бар жұп карталарды табыңыз",
      startGame: "Ойынды бастау",
      restart: "Қайта бастау",
      moves: "Қадамдар",
      pairs: "Жұптар",
      timeLeft: "Уақыт",
      score: "Ұпай",
      howToPlay: "Қалай ойнау:",
      step1: "Картаны аудару үшін басыңыз",
      step2: "Екі бірдей картаны табыңыз",
      step3: "Карталардың орнын есте сақтаңыз",
      step4: "Уақыт біткенше барлық жұптарды табыңыз",
      gameOver: "Уақыт бітті!",
      victory: "Жеңіс!",
      foundAll: "Сіз барлық жұптарды таптыңыз!",
    },
    en: {
      title: "Memory Game",
      subtitle: "Find pairs of cards with historical objects",
      startGame: "Start Game",
      restart: "Restart",
      moves: "Moves",
      pairs: "Pairs",
      timeLeft: "Time",
      score: "Score",
      howToPlay: "How to play:",
      step1: "Click a card to flip it",
      step2: "Find two matching cards",
      step3: "Remember card positions",
      step4: "Find all pairs before time runs out",
      gameOver: "Time's up!",
      victory: "Victory!",
      foundAll: "You found all pairs!",
    },
  };

  const t = translations[language];

  const initializeGame = () => {
    const shuffledItems = [...memoryItems, ...memoryItems]
      .sort(() => Math.random() - 0.5)
      .map((item, index) => ({
        id: index,
        itemId: item.id,
        emoji: item.emoji,
        name: language === 'kz' ? item.nameKz : language === 'en' ? item.nameEn : item.name,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledItems);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setScore(0);
    setTimeLeft(GAME_TIME);
    setGameStarted(true);
    setIsTimerRunning(true);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      toast({
        title: t.gameOver,
        description: `${t.score}: ${score}`,
        variant: "destructive",
      });
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  useEffect(() => {
    if (matchedPairs === memoryItems.length && gameStarted) {
      setIsTimerRunning(false);
      const bonusScore = Math.floor(timeLeft * 0.5);
      const totalScore = score + bonusScore;
      setScore(totalScore);
      
      toast({
        title: t.victory,
        description: t.foundAll,
      });

      // Award points
      const awardPoints = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.rpc('award_game_points', {
            action_type: 'memory_game_complete',
            description_text: `Memory ойынын аяқтады: ${totalScore} ұпай`
          });
        }
      };
      awardPoints();
    }
  }, [matchedPairs]);

  const handleCardClick = (cardId: number) => {
    if (!isTimerRunning) return;
    
    const card = cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) return;

    const newCards = cards.map((c) =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);
    setFlippedCards([...flippedCards, cardId]);

    if (flippedCards.length === 1) {
      setMoves((prev) => prev + 1);
      const firstCard = cards.find((c) => c.id === flippedCards[0]);
      
      if (firstCard && firstCard.itemId === card.itemId) {
        // Match found
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.itemId === card.itemId ? { ...c, isMatched: true } : c
            )
          );
          setMatchedPairs((prev) => prev + 1);
          setScore((prev) => prev + 10);
          setFlippedCards([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === cardId || c.id === flippedCards[0]
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-sand">
        <Navigation />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <Card className="max-w-lg w-full mx-4 p-8 text-center gradient-archaeology shadow-elegant">
            <div className="mb-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Layers className="w-10 h-10 text-primary" />
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
              <span>{t.timeLeft}: {formatTime(GAME_TIME)}</span>
            </div>

            <Button onClick={initializeGame} size="lg" className="w-full gap-2">
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
      <main className="flex-1 pt-20">
        {/* Header */}
        <section className="py-4 bg-gradient-archaeology">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Badge className="text-lg px-4 py-2 gap-2">
                <Clock className="w-4 h-4" />
                {formatTime(timeLeft)}
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2 gap-2">
                <Star className="w-4 h-4" />
                {score} {t.score}
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {t.moves}: {moves}
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {t.pairs}: {matchedPairs}/{memoryItems.length}
              </Badge>
              <Button variant="outline" size="sm" onClick={initializeGame} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                {t.restart}
              </Button>
            </div>
          </div>
        </section>

        {/* Game Grid */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto grid grid-cols-4 gap-3">
              {cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  disabled={card.isMatched || !isTimerRunning}
                  className={`aspect-square rounded-xl text-4xl flex items-center justify-center transition-all duration-300 transform ${
                    card.isFlipped || card.isMatched
                      ? "bg-primary text-white rotate-0 scale-100"
                      : "bg-muted hover:bg-muted/80 cursor-pointer hover:scale-105"
                  } ${card.isMatched ? "opacity-50" : ""}`}
                >
                  {card.isFlipped || card.isMatched ? card.emoji : "❓"}
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MemoryGame;
