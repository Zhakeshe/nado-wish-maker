import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Trophy, Map, BookOpen, Users, Star, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import heroYurt from "@/assets/hero-yurt-art.jpg";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section - Yurt with Neon Style */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden min-h-[90vh] flex items-center">
          <div 
            className="absolute inset-0 bg-cover bg-center -z-10"
            style={{ backgroundImage: `url(${heroYurt})` }}
          />
          <div className="absolute inset-0 bg-black/60 -z-10" />
          <div className="absolute top-0 left-0 w-96 h-96 gradient-hero blur-3xl opacity-30 -z-10" />
          <div className="absolute bottom-0 right-0 w-96 h-96 gradient-neon blur-3xl opacity-30 -z-10" />
          
          <div className="container mx-auto text-center relative z-10">
            <h1 className="font-sans text-6xl md:text-8xl font-black mb-8 neon-text-pink animate-fade-in-up">
              TENGIR
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto font-medium animate-fade-in-up animate-delay-200">
              Узнай историю Казахстана через интерактивные 3D-объекты и получай пойнты.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-400">
              <Button asChild size="lg" className="gap-2 text-lg px-8">
                <Link to="/game">
                  <Trophy className="w-5 h-5" />
                  Начать игру
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2 text-lg px-8">
                <Link to="/auth">
                  <Star className="w-5 h-5" />
                  Зарегистрироваться
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-sans text-3xl md:text-5xl font-bold mb-4 neon-text-yellow">
                Наша миссия
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Объединить историю, технологии и творчество для сохранения и изучения 
                архитектурного наследия Казахстана
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="p-8 gradient-card hover:shadow-soft transition-smooth text-center border-border/50">
                <div className="w-16 h-16 gradient-neon rounded-full flex items-center justify-center mx-auto mb-4 shadow-neon-pink">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3">Образование</h3>
                <p className="text-muted-foreground">
                  Делаем изучение истории увлекательным через интерактивные технологии
                </p>
              </Card>

              <Card className="p-8 gradient-card hover:shadow-soft transition-smooth text-center border-border/50">
                <div className="w-16 h-16 gradient-neon rounded-full flex items-center justify-center mx-auto mb-4 shadow-neon-yellow">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3">Сообщество</h3>
                <p className="text-muted-foreground">
                  Объединяем учеников, учителей и исследователей в одной платформе
                </p>
              </Card>

              <Card className="p-8 gradient-card hover:shadow-soft transition-smooth text-center border-border/50">
                <div className="w-16 h-16 gradient-neon rounded-full flex items-center justify-center mx-auto mb-4 shadow-neon-pink">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3">Геймификация</h3>
                <p className="text-muted-foreground">
                  Зарабатывайте поинты и достижения за изучение культурного наследия
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
                  3D-модели архитектурных объектов
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Изучайте знаменитые памятники Казахстана в интерактивном 3D-формате:
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-sm">✓</span>
                    </div>
                    <span>Мавзолей Айша Биби — шедевр средневековой архитектуры</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-sm">✓</span>
                    </div>
                    <span>Балбал тас — древние каменные изваяния тюркских народов</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-sm">✓</span>
                    </div>
                    <span>Мавзолей Ходжи Ахмеда Ясави и другие памятники</span>
                  </li>
                </ul>
                <Button asChild className="gap-2">
                  <Link to="/projects">
                    Открыть галерею
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>

              <Card className="p-8 gradient-card shadow-soft border-border/50">
                <div className="aspect-video bg-gradient-subtle rounded-lg flex items-center justify-center border border-primary/20">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-neon-pink">
                      <BookOpen className="w-10 h-10 text-primary" />
                    </div>
                    <p className="text-muted-foreground font-semibold">3D-просмотр объектов</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <Card className="p-8 gradient-card shadow-soft order-2 md:order-1 border-border/50">
                <div className="aspect-video bg-gradient-subtle rounded-lg flex items-center justify-center border border-secondary/20">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-neon-yellow">
                      <Map className="w-10 h-10 text-secondary" />
                    </div>
                    <p className="text-muted-foreground font-semibold">Интерактивная карта</p>
                  </div>
                </div>
              </Card>

              <div className="order-1 md:order-2">
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
                  Образовательная игра "Найди на карте"
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Проверьте свои знания географии и истории Казахстана:
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <Trophy className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>Размещайте архитектурные объекты по регионам</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Trophy className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>Зарабатывайте 5-15 поинтов за правильные ответы</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Trophy className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>Узнавайте исторические факты после каждого уровня</span>
                  </li>
                </ul>
                <Button asChild variant="outline" className="gap-2">
                  <Link to="/game">
                    Начать игру
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Points System CTA */}
        <section className="py-20 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <Card className="relative overflow-hidden p-12 md:p-16 text-center gradient-card shadow-soft max-w-4xl mx-auto border-border/50">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 gradient-neon rounded-full flex items-center justify-center mx-auto mb-6 shadow-neon-pink">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                
                <h2 className="font-sans text-3xl md:text-4xl font-bold mb-4 neon-text-pink">
                  Внесите свой вклад
                </h2>
                <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Станьте частью сообщества исследователей. Добавляйте проекты, 
                  публикуйте статьи и зарабатывайте поинты!
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 max-w-3xl mx-auto">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary neon-text-pink mb-1">10</div>
                    <div className="text-sm text-muted-foreground">За регистрацию</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary neon-text-pink mb-1">50</div>
                    <div className="text-sm text-muted-foreground">За новый проект</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary neon-text-yellow mb-1">5-15</div>
                    <div className="text-sm text-muted-foreground">За игру</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary neon-text-pink mb-1">20</div>
                    <div className="text-sm text-muted-foreground">За статью</div>
                  </div>
                </div>
                
                <Button size="lg" className="gap-2">
                  Присоединиться
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
