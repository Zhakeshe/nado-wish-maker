import type { ArchaeologicalObject } from "@/data/archaeologicalObjects";

export interface RegionMarker {
  id: string;
  regionId: string;
  x: number;
  y: number;
  label: string;
  value?: number;
}

const BOUNDS = {
  minLon: 46,
  maxLon: 88,
  minLat: 40,
  maxLat: 56,
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const resolveRegionId = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("север") || lower.includes("акмол")) return "north";
  if (lower.includes("запад") || lower.includes("атырау") || lower.includes("актоб")) return "west";
  if (lower.includes("вост") || lower.includes("вко") || lower.includes("алтай")) return "east";
  if (lower.includes("алматы") || lower.includes("жамбыл")) return "almaty";
  if (lower.includes("юж") || lower.includes("турк")) return "south";
  return "central";
};

export const buildRegionMarkers = (objects: ArchaeologicalObject[]): RegionMarker[] => {
  const aggregated = objects.reduce<Record<string, { lon: number; lat: number; count: number; label: string }>>((acc, obj) => {
    const [lon, lat] = obj.coordinates;
    const regionId = resolveRegionId(obj.region);
    const key = `${regionId}::${obj.region}`;

    if (!acc[key]) {
      acc[key] = { lon: 0, lat: 0, count: 0, label: obj.region };
    }
    acc[key].lon += lon;
    acc[key].lat += lat;
    acc[key].count += 1;
    return acc;
  }, {});

  return Object.entries(aggregated).map(([key, stats], index) => {
    const [regionId, label] = key.split("::");
    const avgLon = stats.lon / stats.count;
    const avgLat = stats.lat / stats.count;
    const normalizedX = ((avgLon - BOUNDS.minLon) / (BOUNDS.maxLon - BOUNDS.minLon)) * 1000;
    const normalizedY = ((BOUNDS.maxLat - avgLat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 620;

    return {
      id: `${regionId}-${index}`,
      regionId,
      x: clamp(normalizedX, 40, 960),
      y: clamp(normalizedY, 40, 580),
      label,
      value: stats.count,
    };
  });
};
