import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Language = "ru" | "kz" | "en";

interface Translations {
  home: string;
  collection: string;
  about: string;
  contact: string;
}

const translations: Record<Language, Translations> = {
  ru: {
    home: "Главная",
    collection: "Коллекция",
    about: "О проекте",
    contact: "Контакты",
  },
  kz: {
    home: "Басты бет",
    collection: "Жинақ",
    about: "Жоба туралы",
    contact: "Байланыс",
  },
  en: {
    home: "Home",
    collection: "Collection",
    about: "About",
    contact: "Contact",
  },
};

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<Language>("ru");

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
            <span className="font-serif font-bold text-xl hidden md:block">
              Музей Казахстана
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              {t.home}
            </Link>
            <Link
              to="/collection"
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              {t.collection}
            </Link>
            <Link
              to="/about"
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              {t.about}
            </Link>
            <Link
              to="/contact"
              className="text-foreground hover:text-primary transition-smooth font-medium"
            >
              {t.contact}
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
              to="/collection"
              className="block text-foreground hover:text-primary transition-smooth font-medium"
              onClick={() => setIsOpen(false)}
            >
              {t.collection}
            </Link>
            <Link
              to="/about"
              className="block text-foreground hover:text-primary transition-smooth font-medium"
              onClick={() => setIsOpen(false)}
            >
              {t.about}
            </Link>
            <Link
              to="/contact"
              className="block text-foreground hover:text-primary transition-smooth font-medium"
              onClick={() => setIsOpen(false)}
            >
              {t.contact}
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
          </div>
        )}
      </div>
    </nav>
  );
};
