import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Trophy, Map, BookOpen, Users, Star, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import heroYurt from "@/assets/hero-yurt-art.jpg";
import { useLanguage, Language } from "@/contexts/LanguageContext";

interface IndexTranslations {
  heroTitle: string;
  heroSubtitle: string;
  startGame: string;
  register: string;
  ourMission: string;
  missionDescription: string;
  education: string;
  educationDesc: string;
  community: string;
  communityDesc: string;
  gamification: string;
  gamificationDesc: string;
  modelsTitle: string;
  modelsDescription: string;
  openGallery: string;
  gameTitle: string;
  gameDescription: string;
  contributeTitle: string;
  contributeDescription: string;
  forRegistration: string;
  forProject: string;
  forGame: string;
  forArticle: string;
  join: string;
}

const indexTranslations: Record<Language, IndexTranslations> = {
  ru: {
    heroTitle: "MuseoNet",
    heroSubtitle: "Узнай историю Казахстана через интерактивные 3D-объекты и получай пойнты.",
    startGame: "Начать игру",
    register: "Зарегистрироваться",
    ourMission: "Наша миссия",
    missionDescription: "Объединить историю, технологии и творчество для сохранения и изучения архитектурного наследия Казахстана",
    education: "Образование",
    educationDesc: "Делаем изучение истории увлекательным через интерактивные технологии",
    community: "Сообщество",
    communityDesc: "Объединяем учеников, учителей и исследователей в одной платформе",
    gamification: "Геймификация",
    gamificationDesc: "Зарабатывайте поинты и достижения за изучение культурного наследия",
    modelsTitle: "3D-модели архитектурных объектов",
    modelsDescription: "Изучайте знаменитые памятники Казахстана в интерактивном 3D-формате:",
    openGallery: "Открыть галерею",
    gameTitle: 'Образовательная игра "Найди на карте"',
    gameDescription: "Проверьте свои знания географии и истории Казахстана:",
    contributeTitle: "Внесите свой вклад",
    contributeDescription: "Станьте частью сообщества исследователей. Добавляйте проекты, публикуйте статьи и зарабатывайте поинты!",
    forRegistration: "За регистрацию",
    forProject: "За новый проект",
    forGame: "За игру",
    forArticle: "За статью",
    join: "Присоединиться",
  },
  kz: {
    heroTitle: "MuseoNet",
    heroSubtitle: "Интерактивті 3D нысандар арқылы Қазақстан тарихын білу және ұпайлар жинау.",
    startGame: "Ойынды бастау",
    register: "Тіркелу",
    ourMission: "Біздің миссия",
    missionDescription: "Қазақстанның сәулет мұрасын сақтау және зерттеу үшін тарих, технология және шығармашылықты біріктіру",
    education: "Білім",
    educationDesc: "Интерактивті технологиялар арқылы тарихты зерттеуді қызықты етеміз",
    community: "Қоғамдастық",
    communityDesc: "Оқушылар, мұғалімдер және зерттеушілерді бір платформада біріктіреміз",
    gamification: "Геймификация",
    gamificationDesc: "Мәдени мұраны зерттегені үшін ұпайлар мен жетістіктер алыңыз",
    modelsTitle: "Сәулет нысандарының 3D үлгілері",
    modelsDescription: "Қазақстанның атақты ескерткіштерін интерактивті 3D форматта зерттеңіз:",
    openGallery: "Галереяны ашу",
    gameTitle: '"Картадан тап" білім беру ойыны',
    gameDescription: "Қазақстанның географиясы мен тарихы бойынша білімді тексеріңіз:",
    contributeTitle: "Өз үлесіңізді қосыңыз",
    contributeDescription: "Зерттеушілер қоғамдастығының бөлігі болыңыз. Жобалар қосыңыз, мақалалар жариялаңыз және ұпайлар жинаңыз!",
    forRegistration: "Тіркелгені үшін",
    forProject: "Жаңа жоба үшін",
    forGame: "Ойын үшін",
    forArticle: "Мақала үшін",
    join: "Қосылу",
  },
  en: {
    heroTitle: "MuseoNet",
    heroSubtitle: "Discover Kazakhstan's history through interactive 3D objects and earn points.",
    startGame: "Start Game",
    register: "Register",
    ourMission: "Our Mission",
    missionDescription: "Unite history, technology and creativity to preserve and study Kazakhstan's architectural heritage",
    education: "Education",
    educationDesc: "Making history learning engaging through interactive technologies",
    community: "Community",
    communityDesc: "Uniting students, teachers and researchers on one platform",
    gamification: "Gamification",
    gamificationDesc: "Earn points and achievements for studying cultural heritage",
    modelsTitle: "3D Models of Architectural Objects",
    modelsDescription: "Study famous monuments of Kazakhstan in interactive 3D format:",
    openGallery: "Open Gallery",
    gameTitle: '"Find on the Map" Educational Game',
    gameDescription: "Test your knowledge of Kazakhstan's geography and history:",
    contributeTitle: "Make Your Contribution",
    contributeDescription: "Become part of the research community. Add projects, publish articles and earn points!",
    forRegistration: "For registration",
    forProject: "For new project",
    forGame: "For game",
    forArticle: "For article",
    join: "Join",
  },
};

const Index = () => {
  const { language } = useLanguage();
  const t = indexTranslations[language];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section - Yurt with Light Style */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden min-h-[90vh] flex items-center">
          <div 
            className="absolute inset-0 bg-cover bg-center -z-10"
            style={{ backgroundImage: `url(${heroYurt})` }}
          />
          <div className="absolute inset-0 bg-white/75 backdrop-blur-sm -z-10" />
          <div className="absolute top-0 left-0 w-96 h-96 gradient-soft blur-3xl opacity-40 -z-10" />
          <div className="absolute bottom-0 right-0 w-96 h-96 gradient-soft blur-3xl opacity-40 -z-10" />
          
          <div className="container mx-auto text-center relative z-10">
            <h1 className="font-sans text-6xl md:text-8xl font-black mb-8 text-primary text-glow-pink animate-fade-in-up">
              {t.heroTitle}
            </h1>
            
            <p className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-3xl mx-auto font-medium animate-fade-in-up animate-delay-200">
              {t.heroSubtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-400">
              <Button asChild size="lg" className="gap-2 text-lg px-8">
                <Link to="/game">
                  <Trophy className="w-5 h-5" />
                  {t.startGame}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2 text-lg px-8">
                <Link to="/auth">
                  <Star className="w-5 h-5" />
                  {t.register}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-sans text-3xl md:text-5xl font-bold mb-4 text-primary text-glow-pink">
                {t.ourMission}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {t.missionDescription}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="p-8 gradient-card hover:shadow-elegant transition-soft text-center bg-card border-border shadow-card">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-foreground">{t.education}</h3>
                <p className="text-muted-foreground">
                  {t.educationDesc}
                </p>
              </Card>

              <Card className="p-8 gradient-card hover:shadow-elegant transition-soft text-center bg-card border-border shadow-card">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-foreground">{t.community}</h3>
                <p className="text-muted-foreground">
                  {t.communityDesc}
                </p>
              </Card>

              <Card className="p-8 gradient-card hover:shadow-elegant transition-soft text-center bg-card border-border shadow-card">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-foreground">{t.gamification}</h3>
                <p className="text-muted-foreground">
                  {t.gamificationDesc}
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
                  {t.modelsTitle}
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  {t.modelsDescription}
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-sm">✓</span>
                    </div>
                    <span>Мавзолей Айша Биби — шедевр средневековой архитектуры</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-sm">✓</span>
                    </div>
                    <span>Балбал тас — древние каменные изваяния тюркских народов</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-sm">✓</span>
                    </div>
                    <span>Мавзолей Ходжи Ахмеда Ясави и другие памятники</span>
                  </li>
                </ul>
                <Button asChild className="gap-2">
                  <Link to="/projects">
                    {t.openGallery}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>

              <Card className="p-8 gradient-card shadow-card hover:shadow-elegant transition-soft bg-card border-border">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border border-primary/10">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-10 h-10 text-primary" />
                    </div>
                    <p className="text-muted-foreground font-semibold">3D-просмотр объектов</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <Card className="p-8 gradient-card shadow-card hover:shadow-elegant transition-soft order-2 md:order-1 bg-card border-border">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border border-secondary/10">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Map className="w-10 h-10 text-secondary" />
                    </div>
                    <p className="text-muted-foreground font-semibold">Интерактивная карта</p>
                  </div>
                </div>
              </Card>

              <div className="order-1 md:order-2">
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
                  {t.gameTitle}
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  {t.gameDescription}
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <Trophy className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>Размещайте архитектурные объекты по регионам</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Trophy className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>Зарабатывайте 5-15 поинтов за правильные ответы</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Trophy className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>Узнавайте исторические факты после каждого уровня</span>
                  </li>
                </ul>
                <Button asChild variant="outline" className="gap-2">
                  <Link to="/game">
                    {t.startGame}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Points System CTA */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <Card className="relative overflow-hidden p-12 md:p-16 text-center gradient-card shadow-elegant max-w-4xl mx-auto bg-card border-border">
              <div className="absolute top-0 right-0 w-64 h-64 gradient-soft rounded-full blur-3xl opacity-50" />
              <div className="absolute bottom-0 left-0 w-64 h-64 gradient-soft rounded-full blur-3xl opacity-50" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                
                <h2 className="font-sans text-3xl md:text-4xl font-bold mb-4 text-primary text-glow-pink">
                  {t.contributeTitle}
                </h2>
                <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                  {t.contributeDescription}
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 max-w-3xl mx-auto">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary text-glow-pink mb-1">10</div>
                    <div className="text-sm text-muted-foreground">{t.forRegistration}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary text-glow-pink mb-1">50</div>
                    <div className="text-sm text-muted-foreground">{t.forProject}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary text-glow-yellow mb-1">5-15</div>
                    <div className="text-sm text-muted-foreground">{t.forGame}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary text-glow-pink mb-1">20</div>
                    <div className="text-sm text-muted-foreground">{t.forArticle}</div>
                  </div>
                </div>
                
                <Button size="lg" className="gap-2">
                  {t.join}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
