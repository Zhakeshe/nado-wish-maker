import { X, Scroll, MapPin, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ArchaeologicalObject } from '@/data/archaeologicalObjects';

interface HistoricalFactModalProps {
  object: ArchaeologicalObject;
  onClose: () => void;
  language: 'ru' | 'kz' | 'en';
}

export const HistoricalFactModal = ({ object, onClose, language }: HistoricalFactModalProps) => {
  const translations = {
    ru: {
      title: "Историческая справка",
      era: "Эпоха",
      region: "Регион",
      facts: "Интересные факты",
      source: "По данным археологических исследований Казахстана",
      close: "Закрыть"
    },
    kz: {
      title: "Тарихи анықтама",
      era: "Дәуір",
      region: "Өңір",
      facts: "Қызықты фактілер",
      source: "Қазақстанның археологиялық зерттеулері бойынша",
      close: "Жабу"
    },
    en: {
      title: "Historical Reference",
      era: "Era",
      region: "Region",
      facts: "Interesting Facts",
      source: "According to archaeological research of Kazakhstan",
      close: "Close"
    }
  };

  const t = translations[language];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto gradient-card shadow-2xl animate-scale-in">
        <div className="relative p-6 md:p-8">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-primary/20">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Scroll className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
              {t.title}
            </h2>
          </div>

          {/* Object details */}
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-xl md:text-2xl font-bold mb-3 text-primary">
                {object.name}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {object.description}
              </p>
            </div>

            {/* Info cards */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-archaeology">
                <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t.era}</p>
                  <p className="font-semibold">{object.era}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-archaeology">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t.region}</p>
                  <p className="font-semibold">{object.region}</p>
                </div>
              </div>
            </div>

            {/* Facts */}
            <div className="bg-muted/30 rounded-lg p-5">
              <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span className="text-primary">•</span>
                {t.facts}
              </h4>
              <ul className="space-y-3">
                {object.facts.map((fact, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                    <span className="text-primary font-bold mt-1 flex-shrink-0">{idx + 1}.</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Source */}
            <div className="text-center pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground italic">
                {t.source}
              </p>
            </div>

            {/* Close button */}
            <Button onClick={onClose} className="w-full" size="lg">
              {t.close}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
