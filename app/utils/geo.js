export function distanceKm(a, b) {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLon = (b.lng - a.lng) * Math.PI / 180;
  const lat1 = a.lat * Math.PI / 180;
  const lat2 = b.lat * Math.PI / 180;
  const s = Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  return R * c;
}

export function nearestCity(pos, cities) {
  if (!pos || !cities || !cities.length) return null;
  let nearest = cities[0];
  let min = distanceKm(pos, nearest);
  for (let i = 1; i < cities.length; i++) {
    const d = distanceKm(pos, cities[i]);
    if (d < min) {
      min = d;
      nearest = cities[i];
    }
  }
  return nearest;
}

export default { distanceKm, nearestCity };
