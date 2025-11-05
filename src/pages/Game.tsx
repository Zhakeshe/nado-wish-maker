import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Map, Target, Award } from "lucide-react";

const Game = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-20">
        {/* Header */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-background rounded-full mb-6 border border-primary/20">
                <Trophy className="w-4 h-4 text-primary fill-primary" />
                <span className="text-sm font-medium">Образовательная игра</span>
              </div>
              
              <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
                Найди на карте
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8">
                Проверьте свои знания географии и истории Казахстана. Правильно размещайте 
                архитектурные объекты по регионам и зарабатывайте поинты!
              </p>
            </div>
          </div>
        </section>

        {/* Game Stats */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <Card className="p-4 text-center gradient-card">
                <Star className="w-6 h-6 text-primary mx-auto mb-2 fill-primary" />
                <div className="text-2xl font-bold mb-1">0</div>
                <div className="text-xs text-muted-foreground">Поинты</div>
              </Card>
              
              <Card className="p-4 text-center gradient-card">
                <Target className="w-6 h-6 text-secondary mx-auto mb-2" />
                <div className="text-2xl font-bold mb-1">0</div>
                <div className="text-xs text-muted-foreground">Уровень</div>
              </Card>
              
              <Card className="p-4 text-center gradient-card">
                <Trophy className="w-6 h-6 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold mb-1">0%</div>
                <div className="text-xs text-muted-foreground">Точность</div>
              </Card>
              
              <Card className="p-4 text-center gradient-card">
                <Award className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold mb-1">0</div>
                <div className="text-xs text-muted-foreground">Достижения</div>
              </Card>
            </div>
          </div>
        </section>

        {/* Game Area */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <Card className="p-8 gradient-card shadow-elegant">
                <div className="text-center mb-8">
                  <Badge className="mb-4">Уровень 1</Badge>
                  <h2 className="font-serif text-2xl font-bold mb-2">
                    Найдите мавзолей Айша Биби на карте
                  </h2>
                  <p className="text-muted-foreground">
                    XI-XII век • Архитектурный памятник
                  </p>
                </div>

                {/* Map Placeholder */}
                <div className="aspect-video bg-gradient-subtle rounded-lg flex items-center justify-center mb-6 border-2 border-dashed border-border">
                  <div className="text-center">
                    <Map className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Интерактивная карта Казахстана</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Кликните на правильный регион
                    </p>
                  </div>
                </div>

                {/* Options */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <Button variant="outline" className="h-auto py-4 px-6 text-left justify-start hover:bg-primary hover:text-primary-foreground transition-colors">
                    <div>
                      <div className="font-semibold mb-1">Алматинская область</div>
                      <div className="text-xs opacity-70">Юго-восток</div>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="h-auto py-4 px-6 text-left justify-start hover:bg-primary hover:text-primary-foreground transition-colors">
                    <div>
                      <div className="font-semibold mb-1">Жамбылская область</div>
                      <div className="text-xs opacity-70">Юг</div>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="h-auto py-4 px-6 text-left justify-start hover:bg-primary hover:text-primary-foreground transition-colors">
                    <div>
                      <div className="font-semibold mb-1">Туркестанская область</div>
                      <div className="text-xs opacity-70">Юг</div>
                    </div>
                  </Button>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button variant="outline">Подсказка (-5 поинтов)</Button>
                  <Button className="gap-2">
                    Подтвердить ответ
                  </Button>
                </div>
              </Card>

              {/* How to Play */}
              <Card className="mt-8 p-6 gradient-card">
                <h3 className="font-bold text-lg mb-4">Как играть:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">1.</span>
                    Прочитайте информацию об объекте
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">2.</span>
                    Выберите правильный регион на карте или из списка
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">3.</span>
                    За правильный ответ получите 5-15 поинтов
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">4.</span>
                    После каждого уровня узнайте исторические факты
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Game;
