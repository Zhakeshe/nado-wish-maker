import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe, User } from "lucide-react";
import { getCurrentUser } from "@/lib/supabase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage, Language } from "@/contexts/LanguageContext";

interface Translations {
  home: string;
  projects: string;
  game: string;
  about: string;
  news: string;
  map: string;
  login: string;
}

const translations: Record<Language, Translations> = {
  ru: {
    home: "Главная",
    projects: "Проекты",
    game: "Игра",
    about: "О нас",
    news: "Новости",
    map: "Карта",
    login: "Войти",
  },
  kz: {
    home: "Басты бет",
    projects: "Жобалар",
    game: "Ойын",
    about: "Біз туралы",
    news: "Жаңалықтар",
    map: "Карта",
    login: "Кіру",
  },
  en: {
    home: "Home",
    projects: "Projects",
    game: "Game",
    about: "About Us",
    news: "News",
    map: "Map",
    login: "Login",
  },
};

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();
  }, []);

  const t = translations[language];

  const languageNames: Record<Language, string> = {
    ru: "Русский",
    kz: "Қазақша",
    en: "English",
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center shadow-gold">
              <span className="text-2xl">🏛️</span>
            </div>
            <span className="font-serif font-bold text-xl hidden md:block bg-gradient-hero bg-clip-text text-transparent">
              MuseoNet
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              {t.home}
            </Link>
            <Link
              to="/projects"
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              {t.projects}
            </Link>
            <Link
              to="/game"
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              {t.game}
            </Link>
            <Link
              to="/about"
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              {t.about}
            </Link>
            <Link
              to="/news"
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              {t.news}
            </Link>
            <Link
              to="/map"
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              {t.map}
            </Link>

            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Globe className="w-4 h-4" />
                  <span className="uppercase text-xs">{language}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {(Object.keys(languageNames) as Language[]).map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={language === lang ? "bg-muted" : ""}
                  >
                    {languageNames[lang]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth Button */}
            {isAuthenticated ? (
              <Button variant="ghost" size="icon" onClick={() => navigate("/profile")}>
                <User className="h-5 w-5" />
              </Button>
            ) : (
              <Button onClick={() => navigate("/auth")}>
                {t.login}
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border">
            <Link
              to="/"
              className="block text-foreground hover:text-primary transition-smooth font-medium"
              onClick={() => setIsOpen(false)}
            >
              {t.home}
            </Link>
            <Link
              to="/projects"
              className="block text-foreground hover:text-primary transition-smooth font-medium"
              onClick={() => setIsOpen(false)}
            >
              {t.projects}
            </Link>
            <Link
              to="/game"
              className="block text-foreground hover:text-primary transition-smooth font-medium"
              onClick={() => setIsOpen(false)}
            >
              {t.game}
            </Link>
            <Link
              to="/about"
              className="block text-foreground hover:text-primary transition-smooth font-medium"
              onClick={() => setIsOpen(false)}
            >
              {t.about}
            </Link>
            <Link
              to="/news"
              className="block text-foreground hover:text-primary transition-smooth font-medium"
              onClick={() => setIsOpen(false)}
            >
              {t.news}
            </Link>
            <Link
              to="/map"
              className="block text-foreground hover:text-primary transition-smooth font-medium"
              onClick={() => setIsOpen(false)}
            >
              {t.map}
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                  <Globe className="w-4 h-4" />
                  <span>{languageNames[language]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-full">
                {(Object.keys(languageNames) as Language[]).map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setIsOpen(false);
                    }}
                    className={language === lang ? "bg-muted" : ""}
                  >
                    {languageNames[lang]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="pt-4 border-t mt-4">
              {isAuthenticated ? (
                <Button className="w-full" onClick={() => { navigate("/profile"); setIsOpen(false); }}>
                  <User className="h-4 w-4 mr-2" />
                  Профиль
                </Button>
              ) : (
                <Button className="w-full" onClick={() => { navigate("/auth"); setIsOpen(false); }}>
                  {t.login}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
