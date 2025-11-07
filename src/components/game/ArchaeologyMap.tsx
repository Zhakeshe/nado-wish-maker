import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { archaeologicalObjects } from '@/data/archaeologicalObjects';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';

interface ArchaeologyMapProps {
  onRegionClick?: (regionName: string) => void;
  highlightedRegion?: string;
  mapboxToken: string;
}

export const ArchaeologyMap = ({ onRegionClick, highlightedRegion, mapboxToken }: ArchaeologyMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [selectedObject, setSelectedObject] = useState<typeof archaeologicalObjects[0] | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [67.5, 48.0], // Center of Kazakhstan
      zoom: 4.5,
      pitch: 0,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: false,
      }),
      'top-right'
    );

    // Add archaeological sites
    map.current.on('load', () => {
      if (!map.current) return;

      // Add custom styling for archaeological theme
      map.current.setPaintProperty('water', 'fill-color', '#E8D5C4');
      map.current.setPaintProperty('land', 'background-color', '#F5EFE6');

      // Add markers for each archaeological object
      archaeologicalObjects.forEach((obj) => {
        if (!map.current) return;

        // Create custom marker element
        const el = document.createElement('div');
        el.className = 'archaeological-marker';
        el.style.width = '32px';
        el.style.height = '32px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = '#E33E64';
        el.style.border = '3px solid #FFD166';
        el.style.cursor = 'pointer';
        el.style.boxShadow = '0 4px 12px rgba(227, 62, 100, 0.4)';
        el.style.transition = 'all 0.3s ease';
        
        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.2)';
          el.style.boxShadow = '0 6px 20px rgba(227, 62, 100, 0.6)';
        });
        
        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)';
          el.style.boxShadow = '0 4px 12px rgba(227, 62, 100, 0.4)';
        });

        const marker = new mapboxgl.Marker(el)
          .setLngLat(obj.coordinates)
          .addTo(map.current!);

        el.addEventListener('click', () => {
          setSelectedObject(obj);
          map.current?.flyTo({
            center: obj.coordinates,
            zoom: 7,
            duration: 1500
          });
        });

        markers.current.push(marker);
      });
    });

    return () => {
      markers.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, [mapboxToken]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg overflow-hidden" 
           style={{
             border: '3px solid #D4A574',
             boxShadow: '0 8px 24px rgba(212, 165, 116, 0.3), inset 0 0 40px rgba(245, 239, 230, 0.1)'
           }} />
      
      {/* Archaeological theme overlay */}
      <div className="absolute inset-0 pointer-events-none rounded-lg"
           style={{
             background: 'radial-gradient(circle at 50% 50%, transparent 60%, rgba(245, 239, 230, 0.4) 100%)',
             mixBlendMode: 'multiply'
           }} />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm p-4 rounded-lg shadow-elegant border border-border">
        <div className="text-sm font-semibold mb-2">Легенда</div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-4 h-4 rounded-full" 
               style={{
                 backgroundColor: '#E33E64',
                 border: '2px solid #FFD166'
               }} />
          <span className="text-muted-foreground">Археологические объекты</span>
        </div>
      </div>

      {/* Object Details Card */}
      {selectedObject && (
        <Card className="absolute top-4 right-4 w-80 p-6 gradient-card shadow-elegant animate-in slide-in-from-right">
          <button 
            onClick={() => setSelectedObject(null)}
            className="absolute top-2 right-2 p-1 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="space-y-3">
            <div>
              <h3 className="font-serif text-xl font-bold mb-1">{selectedObject.name}</h3>
              <p className="text-sm text-primary">{selectedObject.era}</p>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              {selectedObject.description}
            </p>
            
            <div className="pt-3 border-t border-border">
              <p className="text-xs font-semibold mb-2">Интересные факты:</p>
              <ul className="space-y-1">
                {selectedObject.facts.map((fact, idx) => (
                  <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Регион:</span>
                <span className="text-xs font-semibold">{selectedObject.region}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-muted-foreground">За ответ:</span>
                <span className="text-xs font-bold text-primary">+{selectedObject.points} поинтов</span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
