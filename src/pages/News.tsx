import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight } from "lucide-react";

const newsArticles = [
  {
    id: 1,
    title: "Добавлена 3D-модель мавзолея Айша Биби",
    category: "Новость",
    date: "15 ноября 2024",
    author: "Команда TENGIR",
    excerpt: "Теперь вы можете изучить знаменитый архитектурный памятник XI-XII века в интерактивном формате...",
    featured: true,
  },
  {
    id: 2,
    title: "Запущена образовательная игра 'Найди на карте'",
    category: "Обновление",
    date: "10 ноября 2024",
    author: "Команда TENGIR",
    excerpt: "Проверьте свои знания истории и географии Казахстана, зарабатывая поинты...",
    featured: true,
  },
  {
    id: 3,
    title: "История Балбал тас: древние каменные изваяния",
    category: "Статья",
    date: "5 ноября 2024",
    author: "Дина Төлеген",
    excerpt: "Балбал тас — уникальные памятники тюркской культуры, которые можно встретить по всему Казахстану...",
    featured: false,
  },
  {
    id: 4,
    title: "Новые археологические находки в Туркестанской области",
    category: "Исследование",
    date: "1 ноября 2024",
    author: "Арман Серік",
    excerpt: "Экспедиция обнаружила артефакты эпохи Средневековья, которые скоро появятся в нашей коллекции...",
    featured: false,
  },
  {
    id: 5,
    title: "Как использовать 3D-модели в образовании",
    category: "Образование",
    date: "28 октября 2024",
    author: "Айгерім Нұрлан",
    excerpt: "Практические советы для учителей по интеграции интерактивных моделей в учебный процесс...",
    featured: false,
  },
  {
    id: 6,
    title: "Достигнуто 100 пользователей!",
    category: "Вехи",
    date: "20 октября 2024",
    author: "Команда TENGIR",
    excerpt: "Благодарим всех участников сообщества за поддержку проекта TENGIR...",
    featured: false,
  },
];

const News = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-20">
        {/* Header */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
                Новости и блог
              </h1>
              <p className="text-lg text-muted-foreground">
                Последние обновления проекта, статьи об истории Казахстана и находки исследователей
              </p>
            </div>
          </div>
        </section>

        {/* Featured Articles */}
        <section className="py-12 border-b border-border">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-2xl font-bold mb-6">Главные новости</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {newsArticles.filter(article => article.featured).map((article) => (
                <Card key={article.id} className="overflow-hidden gradient-card hover:shadow-elegant transition-smooth group cursor-pointer">
                  <div className="aspect-video bg-gradient-subtle flex items-center justify-center">
                    <Badge className="shadow-gold">{article.category}</Badge>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-4">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{article.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{article.author}</span>
                      </div>
                    </div>

                    <Button variant="ghost" className="gap-2 p-0 h-auto text-primary hover:text-primary-glow">
                      Читать далее
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* All Articles */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-2xl font-bold mb-6">Все публикации</h2>
            
            <div className="grid gap-6 max-w-4xl">
              {newsArticles.filter(article => !article.featured).map((article) => (
                <Card key={article.id} className="p-6 gradient-card hover:shadow-elegant transition-smooth group cursor-pointer">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-48 aspect-video md:aspect-square bg-gradient-subtle rounded-lg flex items-center justify-center flex-shrink-0">
                      <Badge>{article.category}</Badge>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-serif text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{article.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{article.author}</span>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4">
                        {article.excerpt}
                      </p>

                      <Button variant="ghost" className="gap-2 p-0 h-auto text-primary hover:text-primary-glow">
                        Читать далее
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Загрузить ещё
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default News;
