import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Box, Map, Trophy, Upload, Eye, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-subtle -z-10" />
          <div className="absolute top-20 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10" />
          
          <div className="container mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full mb-6">
              <span className="text-sm font-medium">🎉 Добро пожаловать в цифровой музей</span>
            </div>
            
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
              Онлайн-Музей<br />Казахстана
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Изучайте археологические находки и архитектурные памятники в интерактивном 3D-формате. 
              Сохраняйте культурное наследие вместе с нами.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gap-2 shadow-gold">
                <Link to="/collection">
                  <Eye className="w-5 h-5" />
                  Открыть коллекцию
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <Link to="/about">
                  О проекте
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16">
              <div>
                <div className="text-3xl md:text-4xl font-serif font-bold text-primary mb-1">500+</div>
                <div className="text-sm text-muted-foreground">3D-объектов</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-serif font-bold text-secondary mb-1">1200+</div>
                <div className="text-sm text-muted-foreground">Пользователей</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-serif font-bold text-accent mb-1">15</div>
                <div className="text-sm text-muted-foreground">Регионов</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">
                Возможности платформы
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Современные технологии для сохранения и изучения культурного наследия
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8 hover:shadow-elegant transition-smooth gradient-card">
                <div className="w-14 h-14 bg-gradient-hero rounded-xl flex items-center justify-center mb-4 shadow-gold">
                  <Box className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-3">3D-просмотр</h3>
                <p className="text-muted-foreground mb-4">
                  Интерактивное изучение археологических находок и архитектурных объектов 
                  с возможностью вращения, масштабирования и измерений.
                </p>
                <Button variant="ghost" className="gap-2 p-0 h-auto text-primary hover:text-primary-glow">
                  Подробнее <ArrowRight className="w-4 h-4" />
                </Button>
              </Card>

              <Card className="p-8 hover:shadow-elegant transition-smooth gradient-card">
                <div className="w-14 h-14 bg-gradient-hero rounded-xl flex items-center justify-center mb-4 shadow-gold">
                  <Map className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-3">Интерактивная карта</h3>
                <p className="text-muted-foreground mb-4">
                  Географическое расположение всех культурных объектов на карте Казахстана 
                  с фильтрами по эпохам и типам.
                </p>
                <Button variant="ghost" className="gap-2 p-0 h-auto text-primary hover:text-primary-glow">
                  Подробнее <ArrowRight className="w-4 h-4" />
                </Button>
              </Card>

              <Card className="p-8 hover:shadow-elegant transition-smooth gradient-card">
                <div className="w-14 h-14 bg-gradient-hero rounded-xl flex items-center justify-center mb-4 shadow-gold">
                  <Trophy className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-3">Система поинтов</h3>
                <p className="text-muted-foreground mb-4">
                  Зарабатывайте баллы за загрузку объектов, верификацию находок 
                  и участие в развитии коллекции.
                </p>
                <Button variant="ghost" className="gap-2 p-0 h-auto text-primary hover:text-primary-glow">
                  Подробнее <ArrowRight className="w-4 h-4" />
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <Card className="relative overflow-hidden p-12 md:p-16 text-center gradient-card shadow-gold">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-6 shadow-gold">
                  <Upload className="w-8 h-8 text-primary-foreground" />
                </div>
                
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                  Внесите свой вклад
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Присоединяйтесь к сообществу исследователей и энтузиастов культуры. 
                  Загружайте 3D-модели археологических находок и помогайте сохранять историю.
                </p>
                
                <Button size="lg" className="gap-2 shadow-gold">
                  Начать сейчас
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </Card>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">
                Как это работает
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-gold">
                  1
                </div>
                <h3 className="font-bold text-xl mb-2">Регистрация</h3>
                <p className="text-muted-foreground">
                  Создайте бесплатный аккаунт и получите доступ ко всем возможностям платформы
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-elegant">
                  2
                </div>
                <h3 className="font-bold text-xl mb-2">Изучайте</h3>
                <p className="text-muted-foreground">
                  Просматривайте 3D-модели, читайте описания и изучайте карту находок
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-elegant">
                  3
                </div>
                <h3 className="font-bold text-xl mb-2">Участвуйте</h3>
                <p className="text-muted-foreground">
                  Загружайте свои находки, зарабатывайте поинты и становитесь частью сообщества
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Community */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6">
                  Присоединяйтесь к сообществу
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Станьте частью растущего сообщества исследователей, студентов и энтузиастов 
                  культуры Казахстана. Вместе мы сохраняем историю для будущих поколений.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>Более 1200 активных пользователей</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Trophy className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>Система достижений и рейтинга участников</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Box className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>Новые 3D-объекты добавляются каждую неделю</span>
                  </li>
                </ul>
                <Button size="lg" className="gap-2">
                  Начать участие
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="p-6 gradient-card shadow-elegant">
                  <div className="text-3xl font-serif font-bold text-primary mb-1">500+</div>
                  <div className="text-sm text-muted-foreground">Объектов в коллекции</div>
                </Card>
                <Card className="p-6 gradient-card shadow-elegant">
                  <div className="text-3xl font-serif font-bold text-secondary mb-1">50+</div>
                  <div className="text-sm text-muted-foreground">Активных исследователей</div>
                </Card>
                <Card className="p-6 gradient-card shadow-elegant">
                  <div className="text-3xl font-serif font-bold text-accent mb-1">15</div>
                  <div className="text-sm text-muted-foreground">Регионов Казахстана</div>
                </Card>
                <Card className="p-6 gradient-card shadow-elegant">
                  <div className="text-3xl font-serif font-bold text-primary mb-1">8</div>
                  <div className="text-sm text-muted-foreground">Исторических эпох</div>
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

export default Index;
