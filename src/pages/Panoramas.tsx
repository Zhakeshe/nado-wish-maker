import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { PanoramaViewer } from "@/components/PanoramaViewer";
import { PanoramaUploadForm } from "@/components/PanoramaUploadForm";
import { 
  Image as ImageIcon, MapPin, Eye, Plus, User, Clock, RefreshCw 
} from "lucide-react";

interface Panorama {
  id: string;
  title: string;
  description: string | null;
  panorama_url: string;
  thumbnail_url: string | null;
  location: string | null;
  author_id: string | null;
  status: string;
  created_at: string;
}

const translations = {
  ru: {
    title: "360° Панорамы",
    subtitle: "Виртуальные туры по историческим и культурным местам Казахстана",
    totalPanoramas: "панорам",
    uploadPanorama: "Загрузить панораму",
    viewPanorama: "Смотреть",
    noLocation: "Местоположение не указано",
    loginToUpload: "Войдите, чтобы загрузить панораму",
    noPanoramas: "Пока нет панорам",
    beFirst: "Будьте первым, кто загрузит панораму!",
    refresh: "Обновить",
    myPanoramas: "Мои панорамы",
    pending: "На модерации",
    approved: "Одобрено",
  },
  kz: {
    title: "360° Панорамалар",
    subtitle: "Қазақстанның тарихи және мәдени орындары бойынша виртуалды турлар",
    totalPanoramas: "панорама",
    uploadPanorama: "Панорама жүктеу",
    viewPanorama: "Көру",
    noLocation: "Орны көрсетілмеген",
    loginToUpload: "Панорама жүктеу үшін кіріңіз",
    noPanoramas: "Әзірге панорама жоқ",
    beFirst: "Бірінші болып панорама жүктеңіз!",
    refresh: "Жаңарту",
    myPanoramas: "Менің панорамаларым",
    pending: "Модерацияда",
    approved: "Бекітілді",
  },
  en: {
    title: "360° Panoramas",
    subtitle: "Virtual tours of historical and cultural places of Kazakhstan",
    totalPanoramas: "panoramas",
    uploadPanorama: "Upload Panorama",
    viewPanorama: "View",
    noLocation: "Location not specified",
    loginToUpload: "Login to upload panorama",
    noPanoramas: "No panoramas yet",
    beFirst: "Be the first to upload a panorama!",
    refresh: "Refresh",
    myPanoramas: "My panoramas",
    pending: "Pending",
    approved: "Approved",
  },
};

const Panoramas = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const { toast } = useToast();

  const [panoramas, setPanoramas] = useState<Panorama[]>([]);
  const [myPanoramas, setMyPanoramas] = useState<Panorama[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedPanorama, setSelectedPanorama] = useState<Panorama | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session?.user);
      setUserId(session?.user?.id || null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session?.user);
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchPanoramas();
  }, [userId]);

  const fetchPanoramas = async () => {
    setLoading(true);
    
    // Fetch approved panoramas
    const { data: approvedData, error } = await supabase
      .from("panoramas")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      setPanoramas(approvedData || []);
    }

    // Fetch user's own panoramas
    if (userId) {
      const { data: myData } = await supabase
        .from("panoramas")
        .select("*")
        .eq("author_id", userId)
        .order("created_at", { ascending: false });

      setMyPanoramas(myData || []);
    }

    setLoading(false);
  };

  const handleViewPanorama = (panorama: Panorama) => {
    setSelectedPanorama(panorama);
    setViewDialogOpen(true);
  };

  const handleUploadSuccess = () => {
    setUploadDialogOpen(false);
    fetchPanoramas();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === "kz" ? "kk-KZ" : language === "ru" ? "ru-RU" : "en-US",
      { year: "numeric", month: "short", day: "numeric" }
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-sand">
      <Navigation />
      
      <main className="flex-1 pt-16 sm:pt-20">
        {/* Header */}
        <section className="py-8 sm:py-12 bg-gradient-archaeology">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-background rounded-full mb-4 sm:mb-6 border border-primary/20">
                <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                <span className="text-xs sm:text-sm font-medium">
                  {panoramas.length} {t.totalPanoramas}
                </span>
              </div>
              
              <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-hero bg-clip-text text-transparent">
                {t.title}
              </h1>
              <p className="text-sm sm:text-lg text-muted-foreground mb-6">
                {t.subtitle}
              </p>

              <div className="flex flex-wrap gap-3">
                {isAuthenticated ? (
                  <Button onClick={() => setUploadDialogOpen(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    {t.uploadPanorama}
                  </Button>
                ) : (
                  <Button variant="outline" disabled className="gap-2">
                    <Plus className="w-4 h-4" />
                    {t.loginToUpload}
                  </Button>
                )}
                <Button variant="outline" onClick={fetchPanoramas} disabled={loading}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                  {t.refresh}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* My Panoramas (if user has any) */}
        {myPanoramas.length > 0 && (
          <section className="py-6 sm:py-8 bg-muted/30">
            <div className="container mx-auto px-4">
              <h2 className="font-serif text-xl sm:text-2xl font-bold mb-4">{t.myPanoramas}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {myPanoramas.map((panorama) => (
                  <PanoramaCard
                    key={panorama.id}
                    panorama={panorama}
                    onView={handleViewPanorama}
                    language={language}
                    t={t}
                    formatDate={formatDate}
                    showStatus
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Approved Panoramas */}
        <section className="py-8 sm:py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="aspect-video bg-muted" />
                    <CardContent className="p-4 space-y-2">
                      <div className="h-5 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : panoramas.length === 0 ? (
              <div className="text-center py-16">
                <ImageIcon className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">{t.noPanoramas}</h3>
                <p className="text-muted-foreground">{t.beFirst}</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {panoramas.map((panorama) => (
                  <PanoramaCard
                    key={panorama.id}
                    panorama={panorama}
                    onView={handleViewPanorama}
                    language={language}
                    t={t}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-lg">
          <PanoramaUploadForm
            onSuccess={handleUploadSuccess}
            onCancel={() => setUploadDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* View Panorama Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="flex items-center gap-2">
              {selectedPanorama?.title}
              {selectedPanorama?.location && (
                <Badge variant="outline" className="font-normal">
                  <MapPin className="w-3 h-3 mr-1" />
                  {selectedPanorama.location}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 pt-2">
            {selectedPanorama && (
              <>
                <PanoramaViewer
                  imageUrl={selectedPanorama.panorama_url}
                  className="rounded-lg"
                />
                {selectedPanorama.description && (
                  <p className="mt-4 text-sm text-muted-foreground">
                    {selectedPanorama.description}
                  </p>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Panorama Card Component
interface PanoramaCardProps {
  panorama: Panorama;
  onView: (panorama: Panorama) => void;
  language: string;
  t: typeof translations.ru;
  formatDate: (date: string) => string;
  showStatus?: boolean;
}

const PanoramaCard = ({ panorama, onView, language, t, formatDate, showStatus }: PanoramaCardProps) => {
  return (
    <Card className="group overflow-hidden hover:shadow-elegant transition-smooth gradient-card">
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={panorama.thumbnail_url || panorama.panorama_url}
          alt={panorama.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <Button
          size="sm"
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onView(panorama)}
        >
          <Eye className="w-4 h-4 mr-1" />
          {t.viewPanorama}
        </Button>
        
        {/* 360 badge */}
        <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-xs font-medium">
          360°
        </div>

        {showStatus && (
          <Badge
            variant={panorama.status === "approved" ? "default" : "secondary"}
            className="absolute top-3 right-3"
          >
            {panorama.status === "approved" ? t.approved : t.pending}
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-sm sm:text-base mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {panorama.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span className="line-clamp-1">{panorama.location || t.noLocation}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          <Clock className="w-3 h-3" />
          <span>{formatDate(panorama.created_at)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default Panoramas;
