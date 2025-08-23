export async function fetchLastPositionMock(bikeId) {
  return {
    ok: true,
    pos: {
      lat: 43.24,
      lng: 76.91,
      speedKmh: 12,
      tsISO: new Date().toISOString()
    }
  };
}

export async function fetchMonthlyKmMock(userId) {
  return {
    ok: true,
    km: 132
  };
}
