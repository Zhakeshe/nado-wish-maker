import { useMemo, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Filter, Eye } from "lucide-react";
import KazakhstanMap from "@/components/KazakhstanMap";
import { buildRegionMarkers } from "@/utils/regionMarkers";
import { archaeologicalObjects } from "@/data/archaeologicalObjects";

const Map = () => {
  const [selectedRegion, setSelectedRegion] = useState("");

  const markers = useMemo(() => buildRegionMarkers(archaeologicalObjects), []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-20">
        {/* Header */}
        <section className="py-12 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
                Карта объектов
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Географическое расположение всех архитектурных памятников и археологических 
                находок Казахстана
              </p>

              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Все эпохи
                </Button>
                <Badge variant="secondary" className="cursor-pointer">Энеолит</Badge>
                <Badge variant="outline" className="cursor-pointer">Средневековье</Badge>
                <Badge variant="outline" className="cursor-pointer">Новое время</Badge>
                <Badge variant="outline" className="cursor-pointer">Архитектура</Badge>
                <Badge variant="outline" className="cursor-pointer">Археология</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Map Area */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <Card className="overflow-hidden shadow-elegant p-4 md:p-6">
              <KazakhstanMap
                markers={markers}
                showLegend
                selectedRegion={selectedRegion}
                onRegionSelect={setSelectedRegion}
                heading="Авторлық карта / Авторская карта"
                subheading="Mapbox немесе басқа сервистерсіз, тек өзіміз салған интерактивті карта"
                legendNote="Маркерлер бірдей координат жүйесінде есептелді"
              />
              {selectedRegion && (
                <p className="text-xs text-muted-foreground mt-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {`Таңдалған өңір: ${selectedRegion}`}
                </p>
              )}
            </Card>
          </div>
        </section>

        {/* Objects List */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-2xl font-bold mb-6">Объекты на карте</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Мавзолей Айша Биби", region: "Жамбылская обл.", type: "Архитектура", color: "primary" },
                { name: "Балбал тас", region: "Алматинская обл.", type: "Археология", color: "secondary" },
                { name: "Мавзолей Ходжи Ахмеда Ясави", region: "Туркестанская обл.", type: "Архитектура", color: "primary" },
                { name: "Тамгалы-Тас", region: "Алматинская обл.", type: "Петроглифы", color: "accent" },
                { name: "Городище Отрар", region: "Туркестанская обл.", type: "Археология", color: "secondary" },
                { name: "Мавзолей Арыстан-Баба", region: "Туркестанская обл.", type: "Архитектура", color: "primary" },
              ].map((item, index) => (
                <Card key={index} className="p-4 gradient-card hover:shadow-elegant transition-smooth group cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-${item.color}/10`}>
                      <MapPin className={`w-5 h-5 text-${item.color}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold mb-1 group-hover:text-primary transition-colors truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">{item.region}</p>
                      <Badge variant="outline" className="text-xs">{item.type}</Badge>
                    </div>

                    <Button size="sm" variant="ghost" className="flex-shrink-0">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
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

export default Map;
