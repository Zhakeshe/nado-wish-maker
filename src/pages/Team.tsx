import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Users, Heart, Lightbulb } from "lucide-react";

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

const Team = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-20">
        {/* Header */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
                О нас
              </h1>
              <p className="text-lg text-muted-foreground">
                Команда энтузиастов, объединённых любовью к культурному наследию Казахстана
              </p>
            </div>
          </div>
        </section>

        {/* Team Values */}
        <section className="py-12 border-b border-border">
          <div className="container mx-auto px-4">
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
                Ученики и наставники, работающие над проектом TENGIR
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
      </main>

      <Footer />
    </div>
  );
};

export default Team;
