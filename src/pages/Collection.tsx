import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Filter, Eye, MapPin, Loader2, Box } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Viewer3D } from "@/components/Viewer3D";

interface Object3D {
  id: string;
  title: string;
  description: string | null;
  era: string | null;
  region: string | null;
  model_url: string | null;
  thumbnail_url: string | null;
  status: string;
}

const Collection = () => {
  const navigate = useNavigate();
  const [objects, setObjects] = useState<Object3D[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedObject, setSelectedObject] = useState<Object3D | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  useEffect(() => {
    loadObjects();
  }, []);

  const loadObjects = async () => {
    try {
      const { data, error } = await supabase
        .from('objects_3d')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setObjects(data || []);
    } catch (error) {
      console.error("Error loading objects:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredObjects = objects.filter(obj => 
    obj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    obj.era?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    obj.region?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    obj.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openViewer = (obj: Object3D) => {
    setSelectedObject(obj);
    setViewerOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-20 pb-12">
        {/* Header */}
        <section className="bg-gradient-subtle py-12 border-b border-border">
          <div className="container mx-auto px-4">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              3D Объектілер Коллекциясы
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Қазақстанның археологиялық табылымдары мен сәулет ескерткіштерін интерактивті 3D форматта зерттеңіз
            </p>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Атауы, дәуірі, аймақ бойынша іздеу..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Сүзгілер
            </Button>
          </div>

          {/* Filter Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary">Барлық дәуірлер</Badge>
            <Badge variant="outline">Энеолит</Badge>
            <Badge variant="outline">Қола дәуірі</Badge>
            <Badge variant="outline">Сақ дәуірі</Badge>
            <Badge variant="outline">Орта ғасырлар</Badge>
          </div>
        </section>

        {/* Collection Grid */}
        <section className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredObjects.length === 0 ? (
            <div className="text-center py-20">
              <Box className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Объектілер табылмады</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery ? "Іздеу нәтижелері жоқ" : "Әзірге бекітілген 3D объектілер жоқ"}
              </p>
              <Button onClick={() => navigate('/upload-3d')}>
                3D объект жүктеу
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredObjects.map((obj) => (
                <Card
                  key={obj.id}
                  className="overflow-hidden group hover:shadow-elegant transition-smooth cursor-pointer"
                  onClick={() => openViewer(obj)}
                >
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    {obj.thumbnail_url ? (
                      <img
                        src={obj.thumbnail_url}
                        alt={obj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Box className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                    <Badge className="absolute top-3 right-3 bg-primary">
                      3D
                    </Badge>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-smooth flex items-end p-4">
                      <Button size="sm" className="gap-2">
                        <Eye className="w-4 h-4" />
                        3D көру
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif font-bold text-lg mb-2">
                      {obj.title}
                    </h3>
                    {obj.era && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {obj.era}
                      </p>
                    )}
                    {obj.region && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 text-primary" />
                        {obj.region}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Load More */}
          {filteredObjects.length > 0 && (
            <div className="text-center mt-12">
              <Button size="lg" variant="outline" onClick={loadObjects}>
                Жаңарту
              </Button>
            </div>
          )}
        </section>
      </main>

      {/* 3D Viewer Modal */}
      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent className="max-w-5xl h-[80vh] p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>{selectedObject?.title}</DialogTitle>
          </DialogHeader>
          {selectedObject?.model_url ? (
            <div className="flex-1 h-full min-h-[500px]">
              <Viewer3D
                modelUrl={selectedObject.model_url}
                title={selectedObject.title}
                description={selectedObject.description || selectedObject.era || ""}
                showBackground={true}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">3D модель қол жетімсіз</p>
            </div>
          )}
          {selectedObject?.model_url && (
            <div className="p-4 border-t flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => window.open(selectedObject.model_url!, '_blank')}
              >
                Жүктеп алу
              </Button>
              <Button className="flex-1" onClick={() => setViewerOpen(false)}>
                Жабу
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Collection;