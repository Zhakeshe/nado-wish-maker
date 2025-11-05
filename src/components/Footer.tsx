import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                <span className="text-xl">🏛️</span>
              </div>
              <span className="font-serif font-bold">Музей Казахстана</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Цифровой музей, сохраняющий культурное наследие Казахстана для будущих поколений.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Навигация</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-smooth">
                  Главная
                </Link>
              </li>
              <li>
                <Link to="/collection" className="text-muted-foreground hover:text-primary transition-smooth">
                  Коллекция
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-smooth">
                  О проекте
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-smooth">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Ресурсы</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                  Документация
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                  API
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                  Для исследователей
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Контакты</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-primary mt-0.5" />
                <span className="text-muted-foreground">info@museum-kz.org</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-primary mt-0.5" />
                <span className="text-muted-foreground">+7 (700) 123-45-67</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span className="text-muted-foreground">Астана, Казахстан</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Онлайн-Музей Казахстана. Все права защищены.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
              Политика конфиденциальности
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
              Условия использования
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
