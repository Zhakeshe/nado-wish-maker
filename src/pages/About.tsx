import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Target, Users, Globe, Award, Heart, Lightbulb } from "lucide-react";

const teamMembers = [
  {
    name: "Айгерім Нұрлан",
    role: "Основатель проекта",
    description: "Ученица, увлечённая историей Казахстана",
    quote: "История должна быть доступной и увлекательной для всех"
  },
  {
    name: "Арман Серік",
    role: "Технический директор",
    description: "Разработчик 3D-технологий",
    quote: "Технологии помогают оживить прошлое"
  },
  {
    name: "Дина Төлеген",
    role: "Куратор контента",
    description: "Историк и исследователь",
    quote: "Каждый объект хранит уникальную историю"
  },
];

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-20 pb-12">
        {/* Hero */}
        <section className="bg-gradient-subtle py-16 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6">
                О нас
              </h1>
              <p className="text-xl text-muted-foreground">
                Команда энтузиастов, объединённых любовью к культурному наследию Казахстана. 
                Наша миссия — сохранить и представить историю с использованием передовых технологий.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 gradient-card shadow-elegant">
              <Target className="w-12 h-12 text-primary mb-4" />
              <h2 className="font-serif text-2xl font-bold mb-4">Наша миссия</h2>
              <p className="text-muted-foreground leading-relaxed">
                Создание открытой цифровой платформы для сохранения археологических находок, 
                архитектурных памятников и культурных объектов Казахстана. Мы делаем культурное 
                наследие доступным каждому через современные 3D-технологии и интерактивные инструменты.
              </p>
            </Card>

            <Card className="p-8 gradient-card shadow-elegant">
              <Globe className="w-12 h-12 text-secondary mb-4" />
              <h2 className="font-serif text-2xl font-bold mb-4">Наше видение</h2>
              <p className="text-muted-foreground leading-relaxed">
                Стать крупнейшим цифровым музеем Центральной Азии, объединяющим 
                исследователей, студентов и энтузиастов культуры. Мы стремимся к тому, 
                чтобы каждый мог внести свой вклад в сохранение истории и получить 
                доступ к знаниям о прошлом.
              </p>
            </Card>
          </div>
        </section>

        {/* Team Values */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-12">
              Наши ценности
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="p-8 text-center gradient-card">
                <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4 shadow-gold">
                  <Heart className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-xl mb-2">Страсть</h3>
                <p className="text-muted-foreground">
                  Любовь к истории и культуре Казахстана вдохновляет нас каждый день
                </p>
              </Card>

              <Card className="p-8 text-center gradient-card">
                <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4 shadow-gold">
                  <Lightbulb className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-xl mb-2">Инновации</h3>
                <p className="text-muted-foreground">
                  Используем современные технологии для сохранения наследия
                </p>
              </Card>

              <Card className="p-8 text-center gradient-card">
                <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4 shadow-gold">
                  <Users className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-xl mb-2">Сообщество</h3>
                <p className="text-muted-foreground">
                  Создаём платформу для обмена знаниями и совместного обучения
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Team Members */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                Наша команда
              </h2>
              <p className="text-muted-foreground">
                Ученики и наставники, работающие над проектом MuseoNet
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {teamMembers.map((member, index) => (
                <Card key={index} className="p-6 gradient-card hover:shadow-elegant transition-smooth">
                  <div className="w-24 h-24 bg-gradient-subtle rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-12 h-12 text-primary" />
                  </div>
                  
                  <h3 className="font-serif text-xl font-bold text-center mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary text-sm text-center mb-3">
                    {member.role}
                  </p>
                  <p className="text-muted-foreground text-sm text-center mb-4">
                    {member.description}
                  </p>
                  <blockquote className="text-sm italic text-center border-l-2 border-primary pl-4">
                    "{member.quote}"
                  </blockquote>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="bg-muted py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-12">
              Ключевые особенности платформы
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4 shadow-gold">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="font-bold text-xl mb-3">3D-визуализация</h3>
                <p className="text-muted-foreground">
                  Интерактивный просмотр археологических находок и архитектурных объектов 
                  с возможностью изучения деталей
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4 shadow-gold">
                  <span className="text-3xl">🗺️</span>
                </div>
                <h3 className="font-bold text-xl mb-3">Интерактивная карта</h3>
                <p className="text-muted-foreground">
                  Географическое расположение всех объектов культурного наследия 
                  на карте Казахстана
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4 shadow-gold">
                  <span className="text-3xl">⭐</span>
                </div>
                <h3 className="font-bold text-xl mb-3">Система поинтов</h3>
                <p className="text-muted-foreground">
                  Геймификация для вовлечения пользователей: зарабатывайте поинты 
                  за вклад в развитие коллекции
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Target Audience */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-12">
            Для кого наш проект
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center hover:shadow-elegant transition-smooth">
              <Users className="w-10 h-10 text-primary mx-auto mb-3" />
              <h3 className="font-bold mb-2">Студенты</h3>
              <p className="text-sm text-muted-foreground">
                Доступ к визуальным материалам для учебы и исследований
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-elegant transition-smooth">
              <Award className="w-10 h-10 text-primary mx-auto mb-3" />
              <h3 className="font-bold mb-2">Исследователи</h3>
              <p className="text-sm text-muted-foreground">
                Платформа для публикации находок и обмена данными
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-elegant transition-smooth">
              <Target className="w-10 h-10 text-primary mx-auto mb-3" />
              <h3 className="font-bold mb-2">Учителя</h3>
              <p className="text-sm text-muted-foreground">
                Интерактивные материалы для проведения уроков истории
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-elegant transition-smooth">
              <Globe className="w-10 h-10 text-primary mx-auto mb-3" />
              <h3 className="font-bold mb-2">Энтузиасты</h3>
              <p className="text-sm text-muted-foreground">
                Возможность узнать больше о культуре Казахстана
              </p>
            </Card>
          </div>
        </section>

        {/* Partners */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-serif text-3xl font-bold mb-6">
                Партнёры и наставники
              </h2>
              <p className="text-muted-foreground mb-8">
                Мы сотрудничаем с музеями, образовательными учреждениями и 
                культурными организациями Казахстана для создания качественного контента
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="aspect-square flex items-center justify-center gradient-card">
                    <p className="text-muted-foreground text-sm">Партнёр {i}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="bg-gradient-hero py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-primary-foreground">
              <div>
                <div className="font-serif text-4xl md:text-5xl font-bold mb-2">500+</div>
                <div className="text-sm md:text-base opacity-90">3D-объектов</div>
              </div>
              <div>
                <div className="font-serif text-4xl md:text-5xl font-bold mb-2">1200+</div>
                <div className="text-sm md:text-base opacity-90">Пользователей</div>
              </div>
              <div>
                <div className="font-serif text-4xl md:text-5xl font-bold mb-2">50+</div>
                <div className="text-sm md:text-base opacity-90">Исследователей</div>
              </div>
              <div>
                <div className="font-serif text-4xl md:text-5xl font-bold mb-2">15</div>
                <div className="text-sm md:text-base opacity-90">Регионов</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
