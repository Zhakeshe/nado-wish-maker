import { useDrag } from 'react-dnd';
import { Card } from '@/components/ui/card';
import { GripVertical } from 'lucide-react';
import type { ArchaeologicalObject } from '@/data/archaeologicalObjects';

interface DraggableObjectProps {
  object: ArchaeologicalObject;
}

export const DraggableObject = ({ object }: DraggableObjectProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ARCHAEOLOGICAL_OBJECT',
    item: { object },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <Card
      ref={drag}
      className={`p-6 cursor-move gradient-card shadow-elegant transition-all ${
        isDragging ? 'opacity-50 scale-95' : 'hover:shadow-gold hover:scale-105'
      }`}
      style={{
        border: '2px solid #D4A574',
        background: 'linear-gradient(135deg, rgba(245, 239, 230, 0.9) 0%, rgba(255, 255, 255, 0.9) 100%)',
      }}
    >
      <div className="flex items-start gap-4">
        <div className="text-primary mt-1 flex-shrink-0">
          <GripVertical className="w-6 h-6" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-lg font-bold mb-2 line-clamp-1">
            {object.name}
          </h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                {object.era}
              </span>
            </div>
            
            <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed">
              {object.description}
            </p>
            
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <span className="text-xs text-muted-foreground">Перетащите на карту</span>
              <span className="text-xs font-bold text-primary">+{object.points} поинтов</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
