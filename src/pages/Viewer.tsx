import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Viewer3D } from "@/components/Viewer3D";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, Ruler, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import backgroundImage from "@/assets/viewer-background.png";

const Viewer = () => {
  // Mock data - в будущем будет загружаться из базы данных
  const objectData = {
    title: "Мавзолей Айша Бибі",
    description: "Памятник архитектуры XI-XII веков",
    era: "Средневековье",
    region: "Жамбылская область",
    coordinates: { lat: 42.8, lng: 75.3 },
    foundDate: "1856",
    material: "Обожжённый кирпич",
    height: "7.6 м",
    details: `Мавзолей Айша-Биби — уникальный памятник средневековой архитектуры, 
    расположенный недалеко от города Тараз. Построен в XI-XII веках. 
    Мавзолей представляет собой квадратное в плане здание с порталом на главном фасаде. 
    Особую ценность представляет декоративная облицовка стен, выполненная из резных 
    терракотовых плиток с более чем 60 различными орнаментальными узорами.`,
    author: "Архитектурная школа Караханидов",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 mt-16">
        {/* Hero Section with Background */}
        <div 
          className="relative h-[400px] flex items-center justify-center"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          <div className="relative z-10 container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-4">
              {objectData.era}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              {objectData.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {objectData.description}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* 3D Viewer */}
          <div className="mb-8">
            <Viewer3D
              title={objectData.title}
              description={objectData.description}
              showBackground={false}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Information */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>О памятнике</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {objectData.details}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Архитектурные особенности</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Конструкция</h4>
                    <p className="text-sm text-muted-foreground">
                      Квадратное в плане здание с порталом на главном фасаде. 
                      Купол опирается на стены через систему тромпов.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Декор</h4>
                    <p className="text-sm text-muted-foreground">
                      Более 60 различных орнаментальных узоров из резных 
                      терракотовых плиток покрывают стены мавзолея.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Материалы</h4>
                    <p className="text-sm text-muted-foreground">
                      {objectData.material}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar with Metadata */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Характеристики</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Регион</p>
                      <p className="text-sm text-muted-foreground">{objectData.region}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Период</p>
                      <p className="text-sm text-muted-foreground">{objectData.era}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-start gap-3">
                    <Ruler className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Высота</p>
                      <p className="text-sm text-muted-foreground">{objectData.height}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <p className="font-semibold text-sm mb-1">Автор</p>
                    <p className="text-sm text-muted-foreground">{objectData.author}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Поделиться</CardTitle>
                  <CardDescription>Расскажите друзьям об этом объекте</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Поделиться
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Координаты</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    {objectData.coordinates.lat}°N, {objectData.coordinates.lng}°E
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Viewer;
