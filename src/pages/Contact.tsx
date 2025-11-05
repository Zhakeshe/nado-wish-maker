import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Mail, MapPin, Phone, Send } from "lucide-react";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-20 pb-12">
        {/* Header */}
        <section className="bg-gradient-subtle py-12 border-b border-border">
          <div className="container mx-auto px-4">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Свяжитесь с нами
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Есть вопросы или предложения? Мы всегда рады услышать от вас
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="p-6 gradient-card shadow-elegant">
                <Mail className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-bold text-lg mb-2">Email</h3>
                <p className="text-muted-foreground">info@museum-kz.org</p>
                <p className="text-muted-foreground">support@museum-kz.org</p>
              </Card>

              <Card className="p-6 gradient-card shadow-elegant">
                <Phone className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-bold text-lg mb-2">Телефон</h3>
                <p className="text-muted-foreground">+7 (700) 123-45-67</p>
                <p className="text-muted-foreground">Пн-Пт: 9:00 - 18:00</p>
              </Card>

              <Card className="p-6 gradient-card shadow-elegant">
                <MapPin className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-bold text-lg mb-2">Адрес</h3>
                <p className="text-muted-foreground">
                  Астана, Казахстан<br />
                  Проспект Мәңгілік Ел, 55
                </p>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="lg:col-span-2 p-8 gradient-card shadow-elegant">
              <h2 className="font-serif text-2xl font-bold mb-6">
                Отправить сообщение
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Имя</label>
                    <Input placeholder="Ваше имя" required />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" placeholder="your@email.com" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Тема</label>
                  <Input placeholder="О чем ваше сообщение?" required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Сообщение</label>
                  <Textarea
                    placeholder="Расскажите нам подробнее..."
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" size="lg" className="w-full gap-2">
                  <Send className="w-4 h-4" />
                  Отправить сообщение
                </Button>
              </form>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-muted py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-3xl font-bold text-center mb-12">
              Часто задаваемые вопросы
            </h2>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <Card className="p-6">
                <h3 className="font-bold mb-2">Как я могу добавить свой 3D-объект?</h3>
                <p className="text-muted-foreground">
                  Зарегистрируйтесь на платформе и используйте функцию "Загрузить 3D". 
                  Все объекты проходят модерацию перед публикацией.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">Какие форматы 3D-моделей поддерживаются?</h3>
                <p className="text-muted-foreground">
                  Мы поддерживаем форматы .glb, .gltf, .obj и .stl. Рекомендуем использовать .glb 
                  для лучшей совместимости.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">Как работает система поинтов?</h3>
                <p className="text-muted-foreground">
                  Вы зарабатываете поинты за загрузку проверенных 3D-объектов, добавление 
                  описаний и ссылок на научные источники. Поинты отображаются в лидерборде.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">Можно ли использовать материалы в образовательных целях?</h3>
                <p className="text-muted-foreground">
                  Да, все материалы доступны для использования в образовательных и исследовательских целях 
                  с обязательной ссылкой на источник.
                </p>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
