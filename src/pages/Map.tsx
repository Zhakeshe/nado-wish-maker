import { useMemo } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Filter, Eye, Building2, Landmark } from "lucide-react";
import MapboxMap, { OBLAST_DATA } from "@/components/MapboxMap";
import { archaeologicalObjects } from "@/data/archaeologicalObjects";
import { useLanguage } from "@/contexts/LanguageContext";

const Map = () => {
  const { language } = useLanguage();

  // Count objects per region
  const objectCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    
    archaeologicalObjects.forEach((obj) => {
      const region = obj.region;
      // Try to match with oblast data
      const oblast = OBLAST_DATA.find(o => 
        region.includes(o.nameRu) || 
        region.includes(o.nameKz) ||
        o.nameRu.includes(region) ||
        o.nameKz.includes(region)
      );
      
      if (oblast) {
        counts[oblast.id] = (counts[oblast.id] || 0) + 1;
        counts[oblast.nameRu] = (counts[oblast.nameRu] || 0) + 1;
        counts[oblast.nameKz] = (counts[oblast.nameKz] || 0) + 1;
      } else {
        counts[region] = (counts[region] || 0) + 1;
      }
    });
    
    return counts;
  }, []);

  const translations = {
    ru: {
      title: "Карта объектов",
      subtitle: "Географическое расположение всех архитектурных памятников и археологических находок Казахстана",
      allEras: "Все эпохи",
      objectsOnMap: "Объекты на карте",
      totalObjects: "всего объектов",
    },
    kz: {
      title: "Объектілер картасы",
      subtitle: "Қазақстанның барлық сәулет ескерткіштері мен археологиялық жәдігерлерінің географиялық орналасуы",
      allEras: "Барлық дәуірлер",
      objectsOnMap: "Картадағы объектілер",
      totalObjects: "барлығы объект",
    },
    en: {
      title: "Objects Map",
      subtitle: "Geographic location of all architectural monuments and archaeological finds of Kazakhstan",
      allEras: "All eras",
      objectsOnMap: "Objects on map",
      totalObjects: "total objects",
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-sand">
      <Navigation />
      
      <main className="flex-1 pt-20">
        {/* Header */}
        <section className="py-12 bg-gradient-archaeology">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-background rounded-full mb-6 border border-primary/20">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{archaeologicalObjects.length} {t.totalObjects}</span>
              </div>
              
              <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
                {t.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {t.subtitle}
              </p>

              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="w-4 h-4" />
                  {t.allEras}
                </Button>
                <Badge variant="secondary" className="cursor-pointer">
                  {language === 'kz' ? 'Энеолит' : 'Энеолит'}
                </Badge>
                <Badge variant="outline" className="cursor-pointer">
                  {language === 'kz' ? 'Орта ғасыр' : 'Средневековье'}
                </Badge>
                <Badge variant="outline" className="cursor-pointer">
                  {language === 'kz' ? 'Жаңа заман' : 'Новое время'}
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Map Area */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <Card className="overflow-hidden shadow-elegant p-4 md:p-6 gradient-card">
              <MapboxMap 
                language={language}
                objectCounts={objectCounts}
              />
            </Card>
          </div>
        </section>

        {/* Objects List */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-2xl font-bold mb-6">{t.objectsOnMap}</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {archaeologicalObjects.map((item, index) => (
                <Card key={index} className="p-4 gradient-card hover:shadow-elegant transition-smooth group cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-primary/10">
                      <Landmark className="w-5 h-5 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold mb-1 group-hover:text-primary transition-colors truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">{item.region}</p>
                      <Badge variant="outline" className="text-xs">{item.era}</Badge>
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
