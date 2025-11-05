import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Eye, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";

const mockExhibits = [
  {
    id: 1,
    title: "Золотой воин",
    era: "Сакский период (V-III вв. до н.э.)",
    region: "Иссыкский курган",
    imageUrl: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=400&fit=crop",
    verified: true,
  },
  {
    id: 2,
    title: "Керамический сосуд",
    era: "Энеолит (IV-III тыс. до н.э.)",
    region: "Ботайская культура",
    imageUrl: "https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=600&h=400&fit=crop",
    verified: true,
  },
  {
    id: 3,
    title: "Древний орнамент",
    era: "Бронзовый век",
    region: "Южный Казахстан",
    imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&h=400&fit=crop",
    verified: false,
  },
  {
    id: 4,
    title: "Наскальные рисунки",
    era: "Эпоха неолита",
    region: "Тамгалы",
    imageUrl: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&h=400&fit=crop",
    verified: true,
  },
  {
    id: 5,
    title: "Средневековое украшение",
    era: "X-XII века",
    region: "Тараз",
    imageUrl: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&h=400&fit=crop",
    verified: true,
  },
  {
    id: 6,
    title: "Бронзовое оружие",
    era: "Андроновская культура",
    region: "Центральный Казахстан",
    imageUrl: "https://images.unsplash.com/photo-1551641506-ee5c4a18c0b0?w=600&h=400&fit=crop",
    verified: true,
  },
];

const Collection = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-20 pb-12">
        {/* Header */}
        <section className="bg-gradient-subtle py-12 border-b border-border">
          <div className="container mx-auto px-4">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Коллекция 3D-объектов
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Изучайте археологические находки и архитектурные памятники Казахстана в интерактивном 3D-формате
            </p>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Поиск по названию, эпохе, региону..."
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Фильтры
            </Button>
          </div>

          {/* Filter Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary">Все периоды</Badge>
            <Badge variant="outline">Энеолит</Badge>
            <Badge variant="outline">Бронзовый век</Badge>
            <Badge variant="outline">Сакский период</Badge>
            <Badge variant="outline">Средневековье</Badge>
          </div>
        </section>

        {/* Collection Grid */}
        <section className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockExhibits.map((exhibit) => (
              <Card
                key={exhibit.id}
                className="overflow-hidden group hover:shadow-elegant transition-smooth cursor-pointer"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={exhibit.imageUrl}
                    alt={exhibit.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                  />
                  {exhibit.verified && (
                    <Badge className="absolute top-3 right-3 bg-primary">
                      Проверено
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-smooth flex items-end p-4">
                    <Button size="sm" className="gap-2">
                      <Eye className="w-4 h-4" />
                      Просмотр 3D
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-serif font-bold text-lg mb-2">
                    {exhibit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {exhibit.era}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary" />
                    {exhibit.region}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button size="lg" variant="outline">
              Загрузить больше экспонатов
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Collection;
