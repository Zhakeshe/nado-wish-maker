import { useMemo } from "react";
import { Sparkles, MapPin } from "lucide-react";
import type { RegionMarker } from "@/utils/regionMarkers";

interface RegionShape {
  id: string;
  name: string;
  path: string;
}

interface KazakhstanMapProps {
  markers: RegionMarker[];
  selectedRegion?: string;
  onRegionSelect?: (regionId: string) => void;
  onMarkerClick?: (marker: RegionMarker) => void;
  heading?: string;
  subheading?: string;
  legendNote?: string;
  showLegend?: boolean;
}

const regions: RegionShape[] = [
  {
    id: "north",
    name: "Солтүстік Қазақстан",
    path:
      "M320 220l70-40 110-5 90 10 50 40 10 70-70 40-120 10-90-50-50-40z",
  },
  {
    id: "west",
    name: "Батыс Қазақстан",
    path:
      "M150 320l60-50 110-15 60 30 30 80-80 60-110 10-70-70z",
  },
  {
    id: "east",
    name: "Шығыс Қазақстан",
    path:
      "M620 260l70-40 120-10 110 30 60 70-20 100-120 40-130-30-70-80z",
  },
  {
    id: "south",
    name: "Оңтүстік Қазақстан",
    path:
      "M360 420l80-40 120-5 80 25 30 70-60 60-140 20-120-20-60-70z",
  },
  {
    id: "central",
    name: "Орталық Қазақстан",
    path:
      "M380 280l100-50 120 10 70 60-20 70-120 30-120-20-50-60z",
  },
  {
    id: "almaty",
    name: "Алматы өңірі",
    path:
      "M650 420l80-20 90 10 50 70-80 80-100-20-40-60z",
  },
];

const basePalette = {
  idle: "#0f172a",
  hover: "#ca8a04",
  active: "#b45309",
  land: "#fef9c3",
  water: "#e0f2fe",
};

const KazakhstanMap = ({
  markers,
  selectedRegion,
  onRegionSelect,
  onMarkerClick,
  heading = "Қазақстан картасы",
  subheading = "Mapbox қолданбайтын толық интерактивті карта",
  legendNote = "Өңірді таңдаңыз немесе маркерді басыңыз",
  showLegend = true,
}: KazakhstanMapProps) => {
  const highlightedRegion = useMemo(
    () => regions.find((region) => region.id === selectedRegion)?.id,
    [selectedRegion]
  );

  return (
    <div className="w-full space-y-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-background shadow-soft border-primary/20">
          <MapPin className="w-4 h-4 text-primary" aria-hidden />
          <span className="text-sm font-semibold text-primary">{heading}</span>
        </div>
        <p className="text-sm text-muted-foreground">{subheading}</p>
      </div>

      <div className="relative w-full overflow-hidden rounded-2xl border-2 border-primary/20 shadow-elegant bg-gradient-to-br from-amber-50 via-amber-100/60 to-amber-200/40 dark:from-slate-900 dark:via-slate-900/70 dark:to-slate-950">
        <svg
          viewBox="0 0 1000 620"
          className="w-full h-[420px] md:h-[540px]"
          role="img"
          aria-label="Kazakhstan regional map"
        >
          <rect width="1000" height="620" fill={basePalette.water} opacity={0.35} />
          {regions.map((region) => {
            const isActive = highlightedRegion === region.id;
            return (
              <path
                key={region.id}
                d={region.path}
                onClick={() => onRegionSelect?.(region.id)}
                className="transition-colors cursor-pointer"
                fill={isActive ? basePalette.active : basePalette.land}
                stroke={isActive ? basePalette.hover : basePalette.idle}
                strokeWidth={4}
                opacity={0.95}
              />
            );
          })}

          {markers.map((marker) => (
            <g key={marker.id} transform={`translate(${marker.x} ${marker.y})`}>
              <circle
                r={9}
                className="transition-colors"
                fill={selectedRegion === marker.regionId ? basePalette.hover : basePalette.idle}
                stroke="#fff"
                strokeWidth={3}
              />
              <rect
                x={14}
                y={-14}
                rx={10}
                ry={10}
                width={160}
                height={30}
                fill="rgba(255,255,255,0.92)"
                className="drop-shadow-sm"
              />
              <text x={22} y={6} className="text-xs font-semibold fill-slate-800">
                {marker.label}
              </text>
              <rect
                x={-12}
                y={-12}
                width={24}
                height={24}
                rx={6}
                ry={6}
                fill="transparent"
                onClick={() => {
                  onRegionSelect?.(marker.regionId);
                  onMarkerClick?.(marker);
                }}
                className="cursor-pointer"
              />
            </g>
          ))}
        </svg>

        {showLegend && (
          <div className="absolute bottom-4 right-4 max-w-xs bg-background/95 backdrop-blur border rounded-xl shadow-soft p-4 space-y-3">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <Sparkles className="w-4 h-4" aria-hidden />
              <span>Авторлық карта</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{legendNote}</p>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: basePalette.hover }} />
              <span>Белсенді өңір</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KazakhstanMap;
