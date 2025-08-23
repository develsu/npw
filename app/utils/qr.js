export function parseQr(str) {
  if (!str) return null;
  const m1 = str.match(/^ecobike:station:(\w+)/i);
  if (m1) return { stationId: m1[1] };
  const m2 = str.match(/^https?:\/\/eco-bike\.kz\/s\/(\w+)/i);
  if (m2) return { stationId: m2[1] };
  return null;
}
export default { parseQr };
