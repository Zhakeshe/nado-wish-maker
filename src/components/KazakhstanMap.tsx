import { useMemo } from "react";
import { Sparkles, MapPin } from "lucide-react";
import type { RegionMarker } from "@/utils/regionMarkers";

interface RegionShape {
  id: string;
  name: string;
  nameRu: string;
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

// Realistic Kazakhstan regions SVG paths
const regions: RegionShape[] = [
  {
    id: "west-kazakhstan",
    name: "Батыс Қазақстан",
    nameRu: "Западно-Казахстанская область",
    path: "M45,180 L60,165 L75,170 L90,155 L105,160 L110,145 L125,150 L130,135 L145,140 L150,125 L165,130 L170,145 L155,160 L160,175 L145,190 L150,205 L135,220 L120,215 L105,230 L90,225 L75,240 L60,235 L45,250 L30,245 L25,230 L40,215 L35,200 L50,185 Z"
  },
  {
    id: "atyrau",
    name: "Атырау",
    nameRu: "Атырауская область",
    path: "M75,240 L90,225 L105,230 L120,245 L135,240 L150,255 L145,270 L130,285 L115,280 L100,295 L85,290 L70,305 L55,300 L50,285 L65,270 L60,255 Z"
  },
  {
    id: "mangystau",
    name: "Маңғыстау",
    nameRu: "Мангистауская область",
    path: "M55,300 L70,305 L85,320 L100,315 L115,330 L110,345 L95,360 L80,355 L65,370 L50,365 L45,350 L60,335 L55,320 L40,325 L35,310 L50,295 Z"
  },
  {
    id: "aktobe",
    name: "Ақтөбе",
    nameRu: "Актюбинская область",
    path: "M150,125 L180,110 L210,115 L240,100 L270,105 L290,90 L310,95 L325,110 L315,130 L330,145 L320,165 L305,160 L290,175 L275,170 L260,185 L245,180 L230,195 L215,190 L200,205 L185,200 L170,215 L155,210 L150,195 L165,180 L160,165 L175,150 L170,135 Z"
  },
  {
    id: "kostanay",
    name: "Қостанай",
    nameRu: "Костанайская область",
    path: "M290,90 L320,75 L350,80 L380,65 L410,70 L435,55 L460,60 L475,75 L465,95 L480,110 L470,130 L455,125 L440,140 L425,135 L410,150 L395,145 L380,160 L365,155 L350,170 L335,165 L320,150 L335,135 L325,115 L340,100 L330,85 L315,90 Z"
  },
  {
    id: "north-kazakhstan",
    name: "Солтүстік Қазақстан",
    nameRu: "Северо-Казахстанская область",
    path: "M460,60 L490,45 L520,50 L550,35 L580,40 L600,55 L590,75 L605,90 L595,110 L580,105 L565,120 L550,115 L535,130 L520,125 L505,140 L490,135 L475,120 L490,105 L480,90 L495,75 L485,60 Z"
  },
  {
    id: "akmola",
    name: "Ақмола",
    nameRu: "Акмолинская область",
    path: "M410,150 L440,140 L470,130 L490,135 L505,150 L520,145 L535,160 L550,155 L565,170 L550,190 L535,185 L520,200 L505,195 L490,210 L475,205 L460,220 L445,215 L430,230 L415,225 L400,210 L415,195 L405,180 L420,165 Z"
  },
  {
    id: "pavlodar",
    name: "Павлодар",
    nameRu: "Павлодарская область",
    path: "M565,120 L595,110 L620,100 L650,105 L675,95 L700,100 L715,115 L705,135 L720,150 L710,170 L695,165 L680,180 L665,175 L650,190 L635,185 L620,200 L605,195 L590,180 L605,165 L595,150 L610,135 L600,120 L585,125 Z"
  },
  {
    id: "karaganda",
    name: "Қарағанды",
    nameRu: "Карагандинская область",
    path: "M320,165 L350,170 L380,175 L410,180 L430,195 L460,200 L490,195 L520,190 L550,185 L565,200 L580,215 L565,235 L550,250 L535,245 L520,260 L505,255 L490,270 L475,265 L460,280 L445,275 L430,290 L415,285 L400,270 L385,265 L370,250 L355,245 L340,230 L325,225 L310,210 L325,195 L315,180 Z"
  },
  {
    id: "east-kazakhstan",
    name: "Шығыс Қазақстан",
    nameRu: "Восточно-Казахстанская область",
    path: "M650,190 L680,180 L710,175 L735,165 L760,170 L780,185 L795,200 L785,220 L800,235 L790,255 L775,250 L760,265 L745,260 L730,275 L715,270 L700,285 L685,280 L670,265 L655,260 L640,245 L625,240 L615,225 L630,210 L620,195 Z"
  },
  {
    id: "abai",
    name: "Абай",
    nameRu: "Область Абай",
    path: "M640,245 L655,260 L670,275 L685,290 L700,305 L690,325 L675,340 L660,335 L645,350 L630,345 L615,330 L600,325 L590,310 L605,295 L595,280 L610,265 L620,250 Z"
  },
  {
    id: "ulytau",
    name: "Ұлытау",
    nameRu: "Область Улытау",
    path: "M260,185 L290,180 L320,185 L340,200 L355,215 L370,230 L355,250 L340,265 L325,260 L310,275 L295,270 L280,255 L265,250 L250,235 L265,220 L255,205 Z"
  },
  {
    id: "kyzylorda",
    name: "Қызылорда",
    nameRu: "Кызылординская область",
    path: "M200,275 L230,260 L260,265 L290,270 L310,285 L330,300 L350,315 L345,335 L330,350 L315,345 L300,360 L285,355 L270,340 L255,335 L240,320 L225,315 L210,300 L195,295 Z"
  },
  {
    id: "turkestan",
    name: "Түркістан",
    nameRu: "Туркестанская область",
    path: "M330,300 L360,290 L390,295 L420,300 L445,315 L465,330 L480,345 L475,365 L460,380 L445,375 L430,390 L415,385 L400,370 L385,365 L370,350 L355,345 L345,330 Z"
  },
  {
    id: "zhambyl",
    name: "Жамбыл",
    nameRu: "Жамбылская область",
    path: "M445,275 L475,265 L505,270 L530,280 L555,295 L575,310 L590,325 L585,345 L570,360 L555,355 L540,370 L525,365 L510,350 L495,345 L480,330 L465,325 L455,310 L470,295 L460,280 Z"
  },
  {
    id: "almaty-region",
    name: "Алматы облысы",
    nameRu: "Алматинская область",
    path: "M555,295 L585,285 L615,290 L640,300 L665,315 L685,330 L700,345 L695,365 L680,380 L665,375 L650,390 L635,385 L620,370 L605,365 L590,350 L575,345 L565,330 L580,315 Z"
  },
  {
    id: "zhetysu",
    name: "Жетісу",
    nameRu: "Область Жетісу",
    path: "M615,330 L640,340 L660,355 L675,370 L690,385 L685,405 L670,420 L655,415 L640,430 L625,425 L610,410 L595,405 L585,390 L600,375 L590,360 L605,345 Z"
  }
];

const basePalette = {
  idle: "#1e293b",
  hover: "#ca8a04",
  active: "#f59e0b",
  land: "#fef3c7",
  landHover: "#fde68a",
  water: "#e0f2fe",
  stroke: "#334155",
};

const KazakhstanMap = ({
  markers,
  selectedRegion,
  onRegionSelect,
  onMarkerClick,
  heading = "Қазақстан картасы",
  subheading = "Интерактивті карта — өңірді таңдаңыз",
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
          viewBox="0 0 850 480"
          className="w-full h-[420px] md:h-[540px]"
          role="img"
          aria-label="Интерактивная карта Казахстана"
        >
          <defs>
            <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.15" />
            </filter>
            <linearGradient id="landGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef9c3" />
              <stop offset="100%" stopColor="#fde68a" />
            </linearGradient>
            <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>

          <rect width="850" height="480" fill={basePalette.water} opacity={0.25} />

          {regions.map((region) => {
            const isActive = highlightedRegion === region.id;
            return (
              <g key={region.id}>
                <path
                  d={region.path}
                  onClick={() => onRegionSelect?.(region.id)}
                  className="transition-all duration-200 cursor-pointer hover:brightness-110"
                  fill={isActive ? "url(#activeGradient)" : "url(#landGradient)"}
                  stroke={isActive ? basePalette.active : basePalette.stroke}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  filter="url(#dropShadow)"
                  opacity={0.95}
                />
              </g>
            );
          })}

          {markers.map((marker) => (
            <g key={marker.id} transform={`translate(${marker.x * 0.85} ${marker.y * 0.77})`}>
              <circle
                r={8}
                className="transition-all duration-200"
                fill={selectedRegion === marker.regionId ? basePalette.active : basePalette.idle}
                stroke="#fff"
                strokeWidth={2.5}
                filter="url(#dropShadow)"
              />
              <g className="pointer-events-none">
                <rect
                  x={14}
                  y={-12}
                  rx={8}
                  ry={8}
                  width={Math.max(marker.label.length * 7, 100)}
                  height={24}
                  fill="rgba(255,255,255,0.95)"
                  stroke="rgba(0,0,0,0.1)"
                  strokeWidth={1}
                  filter="url(#dropShadow)"
                />
                <text 
                  x={22} 
                  y={4} 
                  className="text-[11px] font-medium"
                  fill="#1e293b"
                >
                  {marker.label}
                </text>
              </g>
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
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: basePalette.active }} />
              <span>Белсенді өңір</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KazakhstanMap;
