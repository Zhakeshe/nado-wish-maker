import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, Gamepad2, Trophy, Clock, Star, ArrowRight, 
  Brain, Puzzle, History, Shuffle, Search, Image, 
  Timer, Target, Lightbulb, Layers
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

const Games = () => {
  const { language } = useLanguage();

  const translations = {
    ru: {
      title: "Игры",
      subtitle: "Изучайте историю Казахстана в игровой форме",
      availableGames: "Доступные игры",
      comingSoon: "Скоро",
      play: "Играть",
      games: {
        findOnMap: {
          title: "Найти на карте",
          description: "Найдите местоположение археологических объектов на карте Казахстана",
          time: "1.5 минуты",
          points: "До 100 очков",
        },
        quiz: {
          title: "Исторический квиз",
          description: "Отвечайте на вопросы о истории и культуре Казахстана",
          time: "5 минут",
          points: "До 200 очков",
        },
        memory: {
          title: "Память",
          description: "Найдите пары карточек с историческими объектами",
          time: "3 минуты",
          points: "До 80 очков",
        },
        timeline: {
          title: "Хронология",
          description: "Расставьте события в правильном хронологическом порядке",
          time: "5 минут",
          points: "До 150 очков",
        },
        matching: {
          title: "Соответствие",
          description: "Соедините исторические объекты с их описаниями",
          time: "4 минуты",
          points: "До 120 очков",
        },
        wordSearch: {
          title: "Поиск слов",
          description: "Найдите исторические термины в сетке букв",
          time: "5 минут",
          points: "До 100 очков",
        },
        puzzle: {
          title: "Пазл",
          description: "Собирайте изображения древних артефактов",
          time: "Без ограничений",
          points: "До 50 очков",
        },
        trivia: {
          title: "Быстрые факты",
          description: "Быстро отвечайте на вопросы об истории",
          time: "2 минуты",
          points: "До 60 очков",
        },
        guessEra: {
          title: "Угадай эпоху",
          description: "Определите эпоху по изображению артефакта",
          time: "3 минуты",
          points: "До 90 очков",
        },
        fillBlanks: {
          title: "Заполни пропуски",
          description: "Дополните предложения об истории Казахстана",
          time: "4 минуты",
          points: "До 80 очков",
        },
        sortArtifacts: {
          title: "Сортировка артефактов",
          description: "Рассортируйте артефакты по категориям и эпохам",
          time: "5 минут",
          points: "До 110 очков",
        },
        imageQuiz: {
          title: "Викторина по изображениям",
          description: "Угадайте место или объект по фотографии",
          time: "4 минуты",
          points: "До 100 очков",
        },
      },
    },
    kz: {
      title: "Ойындар",
      subtitle: "Қазақстан тарихын ойын арқылы үйреніңіз",
      availableGames: "Қолжетімді ойындар",
      comingSoon: "Жақында",
      play: "Ойнау",
      games: {
        findOnMap: {
          title: "Картадан табу",
          description: "Қазақстан картасынан археологиялық объектілердің орнын табыңыз",
          time: "1.5 минут",
          points: "100 ұпайға дейін",
        },
        quiz: {
          title: "Тарихи викторина",
          description: "Қазақстан тарихы мен мәдениеті туралы сұрақтарға жауап беріңіз",
          time: "5 минут",
          points: "200 ұпайға дейін",
        },
        memory: {
          title: "Жады",
          description: "Тарихи объектілері бар жұп карталарды табыңыз",
          time: "3 минут",
          points: "80 ұпайға дейін",
        },
        timeline: {
          title: "Хронология",
          description: "Оқиғаларды дұрыс хронологиялық тәртіпте орналастырыңыз",
          time: "5 минут",
          points: "150 ұпайға дейін",
        },
        matching: {
          title: "Сәйкестік",
          description: "Тарихи объектілерді олардың сипаттамаларымен байланыстырыңыз",
          time: "4 минут",
          points: "120 ұпайға дейін",
        },
        wordSearch: {
          title: "Сөз іздеу",
          description: "Әріптер торынан тарихи терминдерді табыңыз",
          time: "5 минут",
          points: "100 ұпайға дейін",
        },
        puzzle: {
          title: "Пазл",
          description: "Ежелгі артефактілердің суреттерін жинаңыз",
          time: "Шектеусіз",
          points: "50 ұпайға дейін",
        },
        trivia: {
          title: "Жылдам фактілер",
          description: "Тарих туралы сұрақтарға жылдам жауап беріңіз",
          time: "2 минут",
          points: "60 ұпайға дейін",
        },
        guessEra: {
          title: "Дәуірді тап",
          description: "Артефакт суреті бойынша дәуірді анықтаңыз",
          time: "3 минут",
          points: "90 ұпайға дейін",
        },
        fillBlanks: {
          title: "Бос орындарды толтыр",
          description: "Қазақстан тарихы туралы сөйлемдерді толықтырыңыз",
          time: "4 минут",
          points: "80 ұпайға дейін",
        },
        sortArtifacts: {
          title: "Артефактілерді сұрыптау",
          description: "Артефактілерді санаттар мен дәуірлер бойынша сұрыптаңыз",
          time: "5 минут",
          points: "110 ұпайға дейін",
        },
        imageQuiz: {
          title: "Сурет викторинасы",
          description: "Фотосурет бойынша орынды немесе объектіні табыңыз",
          time: "4 минут",
          points: "100 ұпайға дейін",
        },
      },
    },
    en: {
      title: "Games",
      subtitle: "Learn Kazakhstan's history through games",
      availableGames: "Available Games",
      comingSoon: "Coming Soon",
      play: "Play",
      games: {
        findOnMap: {
          title: "Find on Map",
          description: "Find the location of archaeological objects on the map of Kazakhstan",
          time: "1.5 minutes",
          points: "Up to 100 points",
        },
        quiz: {
          title: "History Quiz",
          description: "Answer questions about the history and culture of Kazakhstan",
          time: "5 minutes",
          points: "Up to 200 points",
        },
        memory: {
          title: "Memory",
          description: "Find pairs of cards with historical objects",
          time: "3 minutes",
          points: "Up to 80 points",
        },
        timeline: {
          title: "Timeline",
          description: "Arrange events in correct chronological order",
          time: "5 minutes",
          points: "Up to 150 points",
        },
        matching: {
          title: "Matching",
          description: "Connect historical objects with their descriptions",
          time: "4 minutes",
          points: "Up to 120 points",
        },
        wordSearch: {
          title: "Word Search",
          description: "Find historical terms in a grid of letters",
          time: "5 minutes",
          points: "Up to 100 points",
        },
        puzzle: {
          title: "Puzzle",
          description: "Assemble images of ancient artifacts",
          time: "Unlimited",
          points: "Up to 50 points",
        },
        trivia: {
          title: "Quick Trivia",
          description: "Quickly answer questions about history",
          time: "2 minutes",
          points: "Up to 60 points",
        },
        guessEra: {
          title: "Guess the Era",
          description: "Determine the era by artifact image",
          time: "3 minutes",
          points: "Up to 90 points",
        },
        fillBlanks: {
          title: "Fill in the Blanks",
          description: "Complete sentences about Kazakhstan's history",
          time: "4 minutes",
          points: "Up to 80 points",
        },
        sortArtifacts: {
          title: "Sort Artifacts",
          description: "Sort artifacts by categories and eras",
          time: "5 minutes",
          points: "Up to 110 points",
        },
        imageQuiz: {
          title: "Image Quiz",
          description: "Guess the place or object from the photo",
          time: "4 minutes",
          points: "Up to 100 points",
        },
      },
    },
  };

  const t = translations[language];

  const games = [
    {
      id: "find-on-map",
      ...t.games.findOnMap,
      icon: MapPin,
      available: true,
      link: "/game",
      color: "primary",
    },
    {
      id: "quiz",
      ...t.games.quiz,
      icon: Brain,
      available: true,
      link: "/quiz",
      color: "secondary",
    },
    {
      id: "memory",
      ...t.games.memory,
      icon: Layers,
      available: false,
      link: "#",
      color: "primary",
    },
    {
      id: "timeline",
      ...t.games.timeline,
      icon: History,
      available: false,
      link: "#",
      color: "secondary",
    },
    {
      id: "matching",
      ...t.games.matching,
      icon: Shuffle,
      available: false,
      link: "#",
      color: "primary",
    },
    {
      id: "wordSearch",
      ...t.games.wordSearch,
      icon: Search,
      available: false,
      link: "#",
      color: "secondary",
    },
    {
      id: "puzzle",
      ...t.games.puzzle,
      icon: Puzzle,
      available: false,
      link: "#",
      color: "primary",
    },
    {
      id: "trivia",
      ...t.games.trivia,
      icon: Lightbulb,
      available: false,
      link: "#",
      color: "secondary",
    },
    {
      id: "guessEra",
      ...t.games.guessEra,
      icon: Timer,
      available: false,
      link: "#",
      color: "primary",
    },
    {
      id: "fillBlanks",
      ...t.games.fillBlanks,
      icon: Target,
      available: false,
      link: "#",
      color: "secondary",
    },
    {
      id: "sortArtifacts",
      ...t.games.sortArtifacts,
      icon: Gamepad2,
      available: false,
      link: "#",
      color: "primary",
    },
    {
      id: "imageQuiz",
      ...t.games.imageQuiz,
      icon: Image,
      available: false,
      link: "#",
      color: "secondary",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-sand">
      <Navigation />

      <main className="flex-1 pt-20">
        {/* Header */}
        <section className="py-12 md:py-16 bg-gradient-archaeology">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-background rounded-full mb-6 border border-primary/20">
                <Gamepad2 className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{t.title}</span>
              </div>

              <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
                {t.subtitle}
              </h1>
            </div>
          </div>
        </section>

        {/* Games Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-2xl font-bold mb-8">{t.availableGames}</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {games.map((game) => (
                <Card
                  key={game.id}
                  className={`p-6 gradient-archaeology shadow-elegant border-2 ${
                    game.available ? "border-primary/30 hover:shadow-gold" : "border-muted/30 opacity-70"
                  } transition-all`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${game.color}/10`}>
                      <game.icon className={`w-6 h-6 text-${game.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-serif text-lg font-bold">{game.title}</h3>
                      </div>
                      {!game.available && (
                        <Badge variant="secondary" className="text-xs">
                          {t.comingSoon}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-2">
                    {game.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="text-xs gap-1">
                      <Clock className="w-3 h-3" />
                      {game.time}
                    </Badge>
                    <Badge variant="outline" className="text-xs gap-1">
                      <Star className="w-3 h-3" />
                      {game.points}
                    </Badge>
                  </div>

                  {game.available ? (
                    <Link to={game.link}>
                      <Button className="w-full gap-2">
                        {t.play}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Button disabled className="w-full gap-2">
                      {t.comingSoon}
                    </Button>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Games;