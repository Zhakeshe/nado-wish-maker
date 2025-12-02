import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Key } from "lucide-react";
import type { RegionMarker } from "@/utils/regionMarkers";

interface MapboxMapProps {
  markers: RegionMarker[];
  onMarkerClick?: (marker: RegionMarker) => void;
}

const MapboxMap = ({ markers, onMarkerClick }: MapboxMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  
  const [token, setToken] = useState(() => localStorage.getItem("mapbox_token") || "");
  const [isMapReady, setIsMapReady] = useState(false);
  const [error, setError] = useState("");

  const initializeMap = () => {
    if (!mapContainer.current || !token) return;
    
    try {
      mapboxgl.accessToken = token;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [66.9237, 48.0196], // Kazakhstan center
        zoom: 4.5,
        pitch: 30,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({ visualizePitch: true }),
        "top-right"
      );

      map.current.on("load", () => {
        setIsMapReady(true);
        setError("");
        localStorage.setItem("mapbox_token", token);
        
        // Add markers
        markers.forEach((marker) => {
          // Convert normalized x/y back to lng/lat (approximate)
          const lng = 46.5 + (marker.x / 100) * (87.3 - 46.5);
          const lat = 55.4 - (marker.y / 100) * (55.4 - 40.6);
          
          const el = document.createElement("div");
          el.className = "mapbox-marker";
          el.innerHTML = `
            <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
          `;
          
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2">
              <strong class="text-sm">${marker.label}</strong>
              ${marker.value ? `<p class="text-xs text-gray-500">${marker.value} объектов</p>` : ""}
            </div>
          `);
          
          const mapboxMarker = new mapboxgl.Marker(el)
            .setLngLat([lng, lat])
            .setPopup(popup)
            .addTo(map.current!);
          
          el.addEventListener("click", () => onMarkerClick?.(marker));
          markersRef.current.push(mapboxMarker);
        });
      });

      map.current.on("error", (e) => {
        console.error("Mapbox error:", e);
        setError("Қате токен немесе желі қатесі");
        setIsMapReady(false);
      });
    } catch (err) {
      setError("Mapbox инициализация қатесі");
      console.error(err);
    }
  };

  useEffect(() => {
    return () => {
      markersRef.current.forEach((m) => m.remove());
      map.current?.remove();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      map.current?.remove();
      markersRef.current = [];
      initializeMap();
    }
  };

  return (
    <div className="w-full space-y-4">
      {!isMapReady && (
        <Card className="p-6 bg-muted/50">
          <div className="flex items-center gap-2 mb-4">
            <Key className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Mapbox токенін енгізіңіз</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            <a 
              href="https://mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              mapbox.com
            </a>
            {" "}сайтына кіріп, public token алыңыз
          </p>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="text"
              placeholder="pk.eyJ1..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={!token.trim()}>
              Қосу
            </Button>
          </form>
          {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        </Card>
      )}

      <div 
        ref={mapContainer} 
        className={`w-full h-[500px] rounded-xl overflow-hidden border shadow-elegant ${!isMapReady ? "hidden" : ""}`}
      />
      
      {isMapReady && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>Mapbox карта · {markers.length} маркер</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              localStorage.removeItem("mapbox_token");
              setIsMapReady(false);
              setToken("");
              map.current?.remove();
            }}
          >
            Токенді өзгерту
          </Button>
        </div>
      )}
    </div>
  );
};

export default MapboxMap;
