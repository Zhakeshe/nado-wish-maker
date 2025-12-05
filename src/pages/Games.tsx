import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Gamepad2, Trophy, Clock, Star, ArrowRight } from "lucide-react";
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
      findOnMap: {
        title: "Найти на карте",
        description: "Найдите местоположение археологических объектов на карте Казахстана. Изучайте историю и зарабатывайте очки!",
        time: "1.5 минуты",
        difficulty: "Средняя",
        points: "До 100 очков",
      },
      quiz: {
        title: "Исторический квиз",
        description: "Отвечайте на вопросы о истории и культуре Казахстана",
        time: "5 минут",
        difficulty: "Разная",
        points: "До 200 очков",
      },
      puzzle: {
        title: "Археологический пазл",
        description: "Собирайте изображения древних артефактов",
        time: "Без ограничений",
        difficulty: "Легкая",
        points: "До 50 очков",
      },
    },
    kz: {
      title: "Ойындар",
      subtitle: "Қазақстан тарихын ойын арқылы үйреніңіз",
      availableGames: "Қолжетімді ойындар",
      comingSoon: "Жақында",
      play: "Ойнау",
      findOnMap: {
        title: "Картадан табу",
        description: "Қазақстан картасынан археологиялық объектілердің орнын табыңыз. Тарихты үйреніп, ұпай жинаңыз!",
        time: "1.5 минут",
        difficulty: "Орташа",
        points: "100 ұпайға дейін",
      },
      quiz: {
        title: "Тарихи викторина",
        description: "Қазақстан тарихы мен мәдениеті туралы сұрақтарға жауап беріңіз",
        time: "5 минут",
        difficulty: "Әртүрлі",
        points: "200 ұпайға дейін",
      },
      puzzle: {
        title: "Археологиялық пазл",
        description: "Ежелгі артефактілердің суреттерін жинаңыз",
        time: "Шектеусіз",
        difficulty: "Оңай",
        points: "50 ұпайға дейін",
      },
    },
    en: {
      title: "Games",
      subtitle: "Learn Kazakhstan's history through games",
      availableGames: "Available Games",
      comingSoon: "Coming Soon",
      play: "Play",
      findOnMap: {
        title: "Find on Map",
        description: "Find the location of archaeological objects on the map of Kazakhstan. Learn history and earn points!",
        time: "1.5 minutes",
        difficulty: "Medium",
        points: "Up to 100 points",
      },
      quiz: {
        title: "History Quiz",
        description: "Answer questions about the history and culture of Kazakhstan",
        time: "5 minutes",
        difficulty: "Various",
        points: "Up to 200 points",
      },
      puzzle: {
        title: "Archaeological Puzzle",
        description: "Assemble images of ancient artifacts",
        time: "Unlimited",
        difficulty: "Easy",
        points: "Up to 50 points",
      },
    },
  };

  const t = translations[language];

  const games = [
    {
      id: "find-on-map",
      ...t.findOnMap,
      icon: MapPin,
      available: true,
      link: "/game",
      color: "primary",
    },
    {
      id: "quiz",
      ...t.quiz,
      icon: Trophy,
      available: true,
      link: "/quiz",
      color: "secondary",
    },
    {
      id: "puzzle",
      ...t.puzzle,
      icon: Gamepad2,
      available: false,
      link: "#",
      color: "accent",
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

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game) => (
                <Card
                  key={game.id}
                  className={`p-6 gradient-archaeology shadow-elegant border-2 ${
                    game.available ? "border-primary/30 hover:shadow-gold" : "border-muted/30 opacity-70"
                  } transition-all`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-${game.color}/10`}>
                      <game.icon className={`w-7 h-7 text-${game.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-serif text-xl font-bold">{game.title}</h3>
                        {!game.available && (
                          <Badge variant="secondary" className="text-xs">
                            {t.comingSoon}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
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
