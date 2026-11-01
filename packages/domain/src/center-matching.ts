export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface CenterCandidate {
  id: string;
  location: GeoPoint;
  availableResponders: number;
  dispatcherIds: string[];
}

export const SEARCH_RADII_KM = [10, 20, 50] as const;
export type SearchRadiusKm = (typeof SEARCH_RADII_KM)[number];

const EARTH_RADIUS_KM = 6371;
const toRad = (deg: number) => (deg * Math.PI) / 180;

/** Great-circle distance (haversine). */
export function distanceKm(a: GeoPoint, b: GeoPoint): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

/**
 * CenterMatchingPolicy: the nearest centers with a free responder, widening the
 * radius 10 → 20 → 50 km. With no match the radius stays at its last step.
 */
export function findCandidates(
  location: GeoPoint,
  centers: CenterCandidate[],
  limit = 5,
): {radiusKm: SearchRadiusKm; candidates: CenterCandidate[]} {
  const ranked = centers
    .filter(center => center.availableResponders > 0)
    .map(center => ({center, km: distanceKm(location, center.location)}))
    .sort((a, b) => a.km - b.km);

  for (const radiusKm of SEARCH_RADII_KM) {
    const inRange = ranked.filter(({km}) => km <= radiusKm);
    if (inRange.length > 0) {
      return {radiusKm, candidates: inRange.slice(0, limit).map(({center}) => center)};
    }
  }
  return {radiusKm: 50, candidates: []};
}
