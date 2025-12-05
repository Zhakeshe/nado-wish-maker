import { useMemo } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Filter, Eye, Landmark } from "lucide-react";
import MapboxMap, { OBLAST_DATA } from "@/components/MapboxMap";
import { archaeologicalObjects } from "@/data/archaeologicalObjects";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

const Map = () => {
  const { language } = useLanguage();

  // Count objects per region
  const objectCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    
    archaeologicalObjects.forEach((obj) => {
      const region = obj.region;
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
      totalObjects: "объектов",
      view3D: "3D просмотр",
    },
    kz: {
      title: "Объектілер картасы",
      subtitle: "Қазақстанның барлық сәулет ескерткіштері мен археологиялық жәдігерлерінің географиялық орналасуы",
      allEras: "Барлық дәуірлер",
      objectsOnMap: "Картадағы объектілер",
      totalObjects: "объект",
      view3D: "3D көру",
    },
    en: {
      title: "Objects Map",
      subtitle: "Geographic location of all architectural monuments and archaeological finds of Kazakhstan",
      allEras: "All eras",
      objectsOnMap: "Objects on map",
      totalObjects: "objects",
      view3D: "View 3D",
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-sand">
      <Navigation />
      
      <main className="flex-1 pt-16 sm:pt-20">
        {/* Header */}
        <section className="py-8 sm:py-12 bg-gradient-archaeology">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-background rounded-full mb-4 sm:mb-6 border border-primary/20">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                <span className="text-xs sm:text-sm font-medium">{archaeologicalObjects.length} {t.totalObjects}</span>
              </div>
              
              <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-hero bg-clip-text text-transparent">
                {t.title}
              </h1>
              <p className="text-sm sm:text-lg text-muted-foreground mb-4 sm:mb-6">
                {t.subtitle}
              </p>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Button variant="outline" size="sm" className="gap-2 text-xs sm:text-sm">
                  <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
                  {t.allEras}
                </Button>
                <Badge variant="secondary" className="cursor-pointer text-xs">
                  {language === 'kz' ? 'Энеолит' : 'Энеолит'}
                </Badge>
                <Badge variant="outline" className="cursor-pointer text-xs">
                  {language === 'kz' ? 'Орта ғасыр' : 'Средневековье'}
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Map Area */}
        <section className="py-4 sm:py-8">
          <div className="container mx-auto px-4">
            <Card className="overflow-hidden shadow-elegant p-3 sm:p-4 md:p-6 gradient-card">
              <MapboxMap 
                language={language}
                objectCounts={objectCounts}
                showObjects={true}
              />
            </Card>
          </div>
        </section>

        {/* Objects List */}
        <section className="py-8 sm:py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{t.objectsOnMap}</h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {archaeologicalObjects.map((item, index) => {
                const name = language === 'kz' ? item.nameKz : language === 'en' ? item.nameEn : item.name;
                const desc = language === 'kz' ? item.descriptionKz : language === 'en' ? item.descriptionEn : item.description;
                const era = language === 'kz' ? item.eraKz : language === 'en' ? item.eraEn : item.era;
                
                return (
                  <Card key={index} className="p-3 sm:p-4 gradient-card hover:shadow-elegant transition-smooth group">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                        <img 
                          src={item.imageUrl || '/placeholder.svg'} 
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm sm:text-base mb-1 group-hover:text-primary transition-colors line-clamp-1">
                          {name}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2">{desc}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-[10px] sm:text-xs">{era}</Badge>
                          <span className="text-xs text-primary font-medium">+{item.points} pts</span>
                        </div>
                      </div>

                      <Button size="sm" variant="ghost" className="flex-shrink-0 p-2" asChild>
                        <Link to={`/viewer/${item.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Map;
