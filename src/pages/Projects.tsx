import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, Calendar, Upload, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const mockProjects = [
  {
    id: 1,
    title: "Мавзолей Айша Биби",
    region: "Жамбылская область",
    era: "XI-XII век",
    type: "Архитектура",
    verified: true,
    image: "placeholder",
  },
  {
    id: 2,
    title: "Балбал тас",
    region: "Алматинская область",
    era: "VI-VIII век",
    type: "Археология",
    verified: true,
    image: "placeholder",
  },
  {
    id: 3,
    title: "Мавзолей Ходжи Ахмеда Ясави",
    region: "Туркестанская область",
    era: "XIV-XV век",
    type: "Архитектура",
    verified: true,
    image: "placeholder",
  },
  {
    id: 4,
    title: "Тамгалы-Тас",
    region: "Алматинская область",
    era: "XIV-XIX век",
    type: "Петроглифы",
    verified: false,
    image: "placeholder",
  },
  {
    id: 5,
    title: "Городище Отрар",
    region: "Туркестанская область",
    era: "I-XVIII век",
    type: "Археология",
    verified: true,
    image: "placeholder",
  },
  {
    id: 6,
    title: "Мавзолей Арыстан-Баба",
    region: "Туркестанская область",
    era: "XII век",
    type: "Архитектура",
    verified: true,
    image: "placeholder",
  },
];

const Projects = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-20">
        {/* Header */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
                3D-галерея объектов
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Изучайте архитектурные памятники и археологические находки Казахстана в интерактивном формате
              </p>
              <Button size="lg" className="gap-2 shadow-gold">
                <Upload className="w-5 h-5" />
                Добавить свой проект
              </Button>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Поиск по названию или региону..."
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Фильтры
              </Button>
            </div>

            <div className="flex gap-2 mt-4 flex-wrap">
              <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                Все эпохи
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                Энеолит
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                Средневековье
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                Новое время
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                Архитектура
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                Археология
              </Badge>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden gradient-card hover:shadow-elegant transition-smooth group cursor-pointer">
                  <div className="aspect-video bg-gradient-subtle flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                    <div className="relative z-10 text-center">
                      <div className="w-16 h-16 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-2">
                        <Eye className="w-8 h-8 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">3D-модель</p>
                    </div>
                    {project.verified && (
                      <Badge className="absolute top-3 right-3 bg-primary shadow-gold">
                        Верифицирован
                      </Badge>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{project.region}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{project.era}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <Badge variant="outline">{project.type}</Badge>
                      <Button size="sm" variant="ghost" className="gap-2">
                        Подробнее
                        <Eye className="w-4 h-4" />
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

export default Projects;
