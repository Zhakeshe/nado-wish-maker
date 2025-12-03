import { useEffect, useRef, useState, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";
import type { RegionMarker } from "@/utils/regionMarkers";

const MAPBOX_TOKEN = "pk.eyJ1IjoidGFua2thZXYiLCJhIjoiY21pcG04M3Z6MGE5ODNncjIwZ3IwcmdqYyJ9.zmsQbqO_tDn7MeFIpFgkPw";

// Kazakhstan oblasts with coordinates [lng, lat] and proper names
export const OBLAST_DATA = [
  { id: "almaty-city", nameKz: "Алматы қ.", nameRu: "г. Алматы", nameEn: "Almaty City", coords: [76.9286, 43.2567] as [number, number] },
  { id: "astana-city", nameKz: "Астана қ.", nameRu: "г. Астана", nameEn: "Astana City", coords: [71.4704, 51.1605] as [number, number] },
  { id: "shymkent-city", nameKz: "Шымкент қ.", nameRu: "г. Шымкент", nameEn: "Shymkent City", coords: [69.5958, 42.3417] as [number, number] },
  { id: "almaty-region", nameKz: "Алматы облысы", nameRu: "Алматинская область", nameEn: "Almaty Region", coords: [77.5, 44.8] as [number, number] },
  { id: "akmola", nameKz: "Ақмола облысы", nameRu: "Акмолинская область", nameEn: "Akmola Region", coords: [69.0, 51.9] as [number, number] },
  { id: "aktobe", nameKz: "Ақтөбе облысы", nameRu: "Актюбинская область", nameEn: "Aktobe Region", coords: [57.2, 50.3] as [number, number] },
  { id: "atyrau", nameKz: "Атырау облысы", nameRu: "Атырауская область", nameEn: "Atyrau Region", coords: [52.0, 47.1] as [number, number] },
  { id: "west-kazakhstan", nameKz: "Батыс Қазақстан облысы", nameRu: "Западно-Казахстанская область", nameEn: "West Kazakhstan", coords: [51.2, 50.0] as [number, number] },
  { id: "zhambyl", nameKz: "Жамбыл облысы", nameRu: "Жамбылская область", nameEn: "Zhambyl Region", coords: [71.4, 43.3] as [number, number] },
  { id: "zhetysu", nameKz: "Жетісу облысы", nameRu: "Область Жетысу", nameEn: "Zhetysu Region", coords: [79.0, 45.0] as [number, number] },
  { id: "karaganda", nameKz: "Қарағанды облысы", nameRu: "Карагандинская область", nameEn: "Karaganda Region", coords: [73.1, 49.8] as [number, number] },
  { id: "kostanay", nameKz: "Қостанай облысы", nameRu: "Костанайская область", nameEn: "Kostanay Region", coords: [63.6, 53.2] as [number, number] },
  { id: "kyzylorda", nameKz: "Қызылорда облысы", nameRu: "Кызылординская область", nameEn: "Kyzylorda Region", coords: [64.0, 44.8] as [number, number] },
  { id: "mangystau", nameKz: "Маңғыстау облысы", nameRu: "Мангистауская область", nameEn: "Mangystau Region", coords: [53.0, 43.6] as [number, number] },
  { id: "pavlodar", nameKz: "Павлодар облысы", nameRu: "Павлодарская область", nameEn: "Pavlodar Region", coords: [76.9, 52.3] as [number, number] },
  { id: "north-kazakhstan", nameKz: "Солтүстік Қазақстан облысы", nameRu: "Северо-Казахстанская область", nameEn: "North Kazakhstan", coords: [69.4, 54.9] as [number, number] },
  { id: "turkestan", nameKz: "Түркістан облысы", nameRu: "Туркестанская область", nameEn: "Turkestan Region", coords: [68.2, 43.3] as [number, number] },
  { id: "ulytau", nameKz: "Ұлытау облысы", nameRu: "Улытауская область", nameEn: "Ulytau Region", coords: [66.9, 48.0] as [number, number] },
  { id: "east-kazakhstan", nameKz: "Шығыс Қазақстан облысы", nameRu: "Восточно-Казахстанская область", nameEn: "East Kazakhstan", coords: [82.6, 49.9] as [number, number] },
  { id: "abai", nameKz: "Абай облысы", nameRu: "Область Абай", nameEn: "Abai Region", coords: [80.4, 49.0] as [number, number] },
];

interface MapboxMapProps {
  markers?: RegionMarker[];
  onMarkerClick?: (marker: RegionMarker) => void;
  language?: 'ru' | 'kz' | 'en';
  objectCounts?: Record<string, number>;
}

const MapboxMap = ({ markers = [], onMarkerClick, language = 'kz', objectCounts = {} }: MapboxMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [isMapReady, setIsMapReady] = useState(false);
  const initRef = useRef(false);

  // Memoize object counts to prevent unnecessary re-renders
  const countsKey = useMemo(() => JSON.stringify(objectCounts), [objectCounts]);

  useEffect(() => {
    if (!mapContainer.current || initRef.current) return;
    initRef.current = true;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [66.9237, 48.0196],
      zoom: 4.5,
      pitch: 20,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      "top-right"
    );

    map.current.on("load", () => {
      setIsMapReady(true);
      addMarkers();
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      initRef.current = false;
    };
  }, []);

  const addMarkers = () => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const counts = JSON.parse(countsKey || '{}');

    OBLAST_DATA.forEach((oblast) => {
      const count = counts[oblast.id] || counts[oblast.nameRu] || counts[oblast.nameKz] || 0;
      const name = language === 'kz' ? oblast.nameKz : language === 'en' ? oblast.nameEn : oblast.nameRu;

      const el = document.createElement("div");
      el.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
      `;
      el.innerHTML = `
        <div style="
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #D4A574, #B8956E);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          border: 3px solid white;
          transition: transform 0.2s;
        " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
          <span style="color: white; font-weight: bold; font-size: 14px;">${count}</span>
        </div>
      `;

      const popup = new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(`
        <div style="padding: 12px; min-width: 180px;">
          <strong style="font-size: 14px; display: block; margin-bottom: 4px;">${name}</strong>
          <p style="font-size: 13px; color: #666; margin: 0;">${count} ${language === 'kz' ? 'объект' : language === 'ru' ? 'объект(ов)' : 'object(s)'}</p>
        </div>
      `);

      const mapboxMarker = new mapboxgl.Marker(el)
        .setLngLat(oblast.coords)
        .setPopup(popup)
        .addTo(map.current!);

      el.addEventListener("click", () => {
        const regionMarker = markers.find(m => 
          m.label === oblast.nameRu || 
          m.label === oblast.nameKz || 
          m.regionId === oblast.id
        );
        if (regionMarker && onMarkerClick) {
          onMarkerClick(regionMarker);
        }
      });

      markersRef.current.push(mapboxMarker);
    });
  };

  // Update markers when counts change
  useEffect(() => {
    if (isMapReady) {
      addMarkers();
    }
  }, [countsKey, language, isMapReady]);

  return (
    <div className="w-full space-y-4">
      <div
        ref={mapContainer}
        className="w-full h-[500px] md:h-[600px] rounded-xl overflow-hidden border shadow-elegant"
      />

      {isMapReady && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>
              {language === 'kz' ? 'Қазақстан картасы' : language === 'ru' ? 'Карта Казахстана' : 'Map of Kazakhstan'} · {OBLAST_DATA.length} {language === 'kz' ? 'облыс' : language === 'ru' ? 'областей' : 'regions'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span>{language === 'kz' ? 'Объектілер саны' : language === 'ru' ? 'Количество объектов' : 'Object count'}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapboxMap;
