import { useEffect, useRef, useState, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin, Eye, ExternalLink } from "lucide-react";
import type { RegionMarker } from "@/utils/regionMarkers";
import { archaeologicalObjects, ArchaeologicalObject } from "@/data/archaeologicalObjects";

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
  showObjects?: boolean;
}

const MapboxMap = ({ markers = [], onMarkerClick, language = 'kz', objectCounts = {}, showObjects = true }: MapboxMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [isMapReady, setIsMapReady] = useState(false);
  const [selectedObject, setSelectedObject] = useState<ArchaeologicalObject | null>(null);
  const initRef = useRef(false);

  const countsKey = useMemo(() => JSON.stringify(objectCounts), [objectCounts]);

  // Create GeoJSON for clustering
  const objectsGeoJSON = useMemo(() => ({
    type: 'FeatureCollection' as const,
    features: archaeologicalObjects.map(obj => ({
      type: 'Feature' as const,
      properties: {
        id: obj.id,
        name: language === 'kz' ? obj.nameKz : language === 'en' ? obj.nameEn : obj.name,
        description: language === 'kz' ? obj.descriptionKz : language === 'en' ? obj.descriptionEn : obj.description,
        era: language === 'kz' ? obj.eraKz : language === 'en' ? obj.eraEn : obj.era,
        region: obj.region,
        imageUrl: obj.imageUrl,
        points: obj.points,
      },
      geometry: {
        type: 'Point' as const,
        coordinates: obj.coordinates,
      },
    })),
  }), [language]);

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
      
      if (showObjects && map.current) {
        // Add source for clustering
        map.current.addSource('objects', {
          type: 'geojson',
          data: objectsGeoJSON,
          cluster: true,
          clusterMaxZoom: 8,
          clusterRadius: 50,
        });

        // Cluster circles
        map.current.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'objects',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#D4A574',
              3, '#B8956E',
              5, '#9A7B5A',
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              25,
              3, 30,
              5, 40,
            ],
            'circle-stroke-width': 3,
            'circle-stroke-color': '#ffffff',
          },
        });

        // Cluster count labels
        map.current.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'objects',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': ['get', 'point_count_abbreviated'],
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 14,
          },
          paint: {
            'text-color': '#ffffff',
          },
        });

        // Individual object markers
        map.current.addLayer({
          id: 'unclustered-point',
          type: 'circle',
          source: 'objects',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': '#E33E64',
            'circle-radius': 10,
            'circle-stroke-width': 3,
            'circle-stroke-color': '#ffffff',
          },
        });

        // Click on cluster to zoom
        map.current.on('click', 'clusters', (e) => {
          if (!map.current) return;
          const features = map.current.queryRenderedFeatures(e.point, { layers: ['clusters'] });
          const clusterId = features[0].properties?.cluster_id;
          const source = map.current.getSource('objects') as mapboxgl.GeoJSONSource;
          
          source.getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err || !map.current) return;
            map.current.easeTo({
              center: (features[0].geometry as GeoJSON.Point).coordinates as [number, number],
              zoom: zoom || 6,
            });
          });
        });

        // Click on individual marker
        map.current.on('click', 'unclustered-point', (e) => {
          if (!e.features || !e.features[0]) return;
          const props = e.features[0].properties;
          const coords = (e.features[0].geometry as GeoJSON.Point).coordinates.slice() as [number, number];
          
          const obj = archaeologicalObjects.find(o => o.id === props?.id);
          if (obj) {
            setSelectedObject(obj);
            
            const name = language === 'kz' ? obj.nameKz : language === 'en' ? obj.nameEn : obj.name;
            const desc = language === 'kz' ? obj.descriptionKz : language === 'en' ? obj.descriptionEn : obj.description;
            const era = language === 'kz' ? obj.eraKz : language === 'en' ? obj.eraEn : obj.era;
            const viewLabel = language === 'kz' ? '3D көру' : language === 'ru' ? '3D просмотр' : 'View 3D';
            
            new mapboxgl.Popup({ offset: 15, maxWidth: '300px' })
              .setLngLat(coords)
              .setHTML(`
                <div style="padding: 8px;">
                  <img src="${obj.imageUrl || '/placeholder.svg'}" alt="${name}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
                  <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 4px;">${name}</h3>
                  <p style="font-size: 12px; color: #666; margin-bottom: 6px;">${desc}</p>
                  <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
                    <span style="background: #f0e6d9; padding: 2px 8px; border-radius: 12px; font-size: 11px;">${era}</span>
                    <span style="color: #E33E64; font-weight: bold; font-size: 12px;">+${obj.points} pts</span>
                  </div>
                  <a href="/viewer/${obj.id}" style="display: flex; align-items: center; justify-content: center; gap: 6px; background: #E33E64; color: white; padding: 8px 12px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 500;">
                    ${viewLabel}
                  </a>
                </div>
              `)
              .addTo(map.current!);
          }
        });

        // Change cursor on hover
        map.current.on('mouseenter', 'clusters', () => {
          if (map.current) map.current.getCanvas().style.cursor = 'pointer';
        });
        map.current.on('mouseleave', 'clusters', () => {
          if (map.current) map.current.getCanvas().style.cursor = '';
        });
        map.current.on('mouseenter', 'unclustered-point', () => {
          if (map.current) map.current.getCanvas().style.cursor = 'pointer';
        });
        map.current.on('mouseleave', 'unclustered-point', () => {
          if (map.current) map.current.getCanvas().style.cursor = '';
        });
      }
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

  // Update GeoJSON source when language changes
  useEffect(() => {
    if (isMapReady && map.current && showObjects) {
      const source = map.current.getSource('objects') as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData(objectsGeoJSON);
      }
    }
  }, [objectsGeoJSON, isMapReady, showObjects]);

  const translations = {
    ru: {
      mapTitle: "Карта Казахстана",
      regions: "областей",
      objectCount: "Объекты",
      zoomIn: "Приблизьте для деталей",
    },
    kz: {
      mapTitle: "Қазақстан картасы",
      regions: "облыс",
      objectCount: "Объектілер",
      zoomIn: "Толық көру үшін жақындатыңыз",
    },
    en: {
      mapTitle: "Map of Kazakhstan",
      regions: "regions",
      objectCount: "Objects",
      zoomIn: "Zoom in for details",
    },
  };

  const t = translations[language];

  return (
    <div className="w-full space-y-4">
      <div
        ref={mapContainer}
        className="w-full h-[400px] sm:h-[500px] md:h-[600px] rounded-xl overflow-hidden border shadow-elegant"
      />

      {isMapReady && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>
              {t.mapTitle} · {archaeologicalObjects.length} {t.objectCount.toLowerCase()}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span>{language === 'kz' ? 'Кластер' : language === 'ru' ? 'Кластер' : 'Cluster'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#E33E64]"></div>
              <span>{language === 'kz' ? 'Объект' : language === 'ru' ? 'Объект' : 'Object'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapboxMap;
