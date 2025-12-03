import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";
import type { RegionMarker } from "@/utils/regionMarkers";

// Public Mapbox token
const MAPBOX_TOKEN = "pk.eyJ1IjoidGFua2thZXYiLCJhIjoiY21pcG04M3Z6MGE5ODNncjIwZ3IwcmdqYyJ9.zmsQbqO_tDn7MeFIpFgkPw";

// Kazakhstan region coordinates (lng, lat)
const REGION_COORDINATES: Record<string, [number, number]> = {
  "Алматы облысы": [77.0, 44.5],
  "Алматинская область": [77.0, 44.5],
  "Жамбыл облысы": [71.4, 43.3],
  "Жамбылская область": [71.4, 43.3],
  "Түркістан облысы": [68.2, 43.3],
  "Туркестанская область": [68.2, 43.3],
  "Қызылорда облысы": [64.0, 44.8],
  "Кызылординская область": [64.0, 44.8],
  "Маңғыстау облысы": [53.0, 43.6],
  "Мангистауская область": [53.0, 43.6],
  "Атырау облысы": [52.0, 47.1],
  "Атырауская область": [52.0, 47.1],
  "Батыс Қазақстан облысы": [51.2, 50.0],
  "Западно-Казахстанская область": [51.2, 50.0],
  "Ақтөбе облысы": [57.2, 50.3],
  "Актюбинская область": [57.2, 50.3],
  "Қостанай облысы": [63.6, 53.2],
  "Костанайская область": [63.6, 53.2],
  "Солтүстік Қазақстан облысы": [69.4, 54.9],
  "Северо-Казахстанская область": [69.4, 54.9],
  "Ақмола облысы": [69.0, 51.9],
  "Акмолинская область": [69.0, 51.9],
  "Павлодар облысы": [76.9, 52.3],
  "Павлодарская область": [76.9, 52.3],
  "Қарағанды облысы": [73.1, 49.8],
  "Карагандинская область": [73.1, 49.8],
  "Шығыс Қазақстан облысы": [82.6, 49.9],
  "Восточно-Казахстанская область": [82.6, 49.9],
  "Ұлытау облысы": [66.9, 48.0],
  "Улытауская область": [66.9, 48.0],
  "Абай облысы": [80.4, 49.0],
  "Область Абай": [80.4, 49.0],
  "Жетісу облысы": [79.0, 45.0],
  "Область Жетысу": [79.0, 45.0],
  "Астана": [71.4, 51.1],
  "Алматы": [76.9, 43.2],
  "Шымкент": [69.6, 42.3],
};

interface MapboxMapProps {
  markers: RegionMarker[];
  onMarkerClick?: (marker: RegionMarker) => void;
}

const MapboxMap = ({ markers, onMarkerClick }: MapboxMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [66.9237, 48.0196],
      zoom: 4,
      pitch: 20,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      "top-right"
    );

    map.current.on("load", () => {
      setIsMapReady(true);

      // Add markers
      markers.forEach((marker) => {
        const coords = REGION_COORDINATES[marker.label];
        if (!coords) {
          console.warn(`No coordinates for region: ${marker.label}`);
          return;
        }

        const el = document.createElement("div");
        el.className = "mapbox-marker";
        el.innerHTML = `
          <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform border-2 border-white">
            <span class="text-white font-bold text-sm">${marker.value || ""}</span>
          </div>
        `;

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-3">
            <strong class="text-base">${marker.label}</strong>
            ${marker.value ? `<p class="text-sm text-gray-600 mt-1">${marker.value} объект</p>` : ""}
          </div>
        `);

        const mapboxMarker = new mapboxgl.Marker(el)
          .setLngLat(coords)
          .setPopup(popup)
          .addTo(map.current!);

        el.addEventListener("click", () => onMarkerClick?.(marker));
        markersRef.current.push(mapboxMarker);
      });
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      map.current?.remove();
      map.current = null;
    };
  }, [markers, onMarkerClick]);

  return (
    <div className="w-full space-y-4">
      <div
        ref={mapContainer}
        className="w-full h-[500px] rounded-xl overflow-hidden border shadow-elegant"
      />

      {isMapReady && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>Қазақстан картасы · {markers.length} аймақ</span>
        </div>
      )}
    </div>
  );
};

export default MapboxMap;
