import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { archaeologicalObjects } from '@/data/archaeologicalObjects';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';

interface ArchaeologyMapProps {
  onRegionClick?: (regionName: string) => void;
  highlightedRegion?: string;
}

// Custom marker icon
const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #E33E64;
      border: 3px solid #FFD166;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(227, 62, 100, 0.4);
      transition: all 0.3s ease;
    "></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Component to handle map effects and initialization
const MapEffects = ({ onMapReady }: { onMapReady: (map: L.Map) => void }) => {
  const map = useMap();
  
  useEffect(() => {
    // Add archaeological theme styling
    const style = document.createElement('style');
    style.textContent = `
      .leaflet-tile-container {
        filter: sepia(0.3) hue-rotate(10deg) saturate(0.8);
      }
      .leaflet-container {
        background: #F5EFE6;
      }
      .custom-marker:hover > div {
        transform: scale(1.2);
        box-shadow: 0 6px 20px rgba(227, 62, 100, 0.6);
      }
    `;
    document.head.appendChild(style);
    
    // Pass map instance to parent
    onMapReady(map);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [map, onMapReady]);
  
  return null;
};

export const ArchaeologyMap = ({ onRegionClick, highlightedRegion }: ArchaeologyMapProps) => {
  const [selectedObject, setSelectedObject] = useState<typeof archaeologicalObjects[0] | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);

  const handleMarkerClick = (obj: typeof archaeologicalObjects[0]) => {
    setSelectedObject(obj);
    if (map) {
      map.flyTo(obj.coordinates, 7, {
        duration: 1.5
      });
    }
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 rounded-lg overflow-hidden" 
           style={{
             border: '3px solid #D4A574',
             boxShadow: '0 8px 24px rgba(212, 165, 116, 0.3), inset 0 0 40px rgba(245, 239, 230, 0.1)'
           }}>
        <MapContainer
          center={[48.0, 67.5]}
          zoom={5}
          className="w-full h-full"
          zoomControl={true}
        >
          <MapEffects onMapReady={setMap} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {archaeologicalObjects.map((obj) => (
            <Marker
              key={obj.id}
              position={obj.coordinates}
              icon={createCustomIcon()}
              eventHandlers={{
                click: () => handleMarkerClick(obj),
              }}
            >
              <Popup>
                <div className="text-sm">
                  <h3 className="font-bold">{obj.name}</h3>
                  <p className="text-xs text-muted-foreground">{obj.era}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      {/* Archaeological theme overlay */}
      <div className="absolute inset-0 pointer-events-none rounded-lg"
           style={{
             background: 'radial-gradient(circle at 50% 50%, transparent 60%, rgba(245, 239, 230, 0.4) 100%)',
             mixBlendMode: 'multiply'
           }} />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm p-4 rounded-lg shadow-elegant border border-border z-[1000]">
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
        <Card className="absolute top-4 right-4 w-80 p-6 gradient-card shadow-elegant animate-in slide-in-from-right z-[1000]">
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
