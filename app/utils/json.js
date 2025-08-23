export async function loadJson(url) {
  try {
    const mod = await import(url, { with: { type: 'json' } });
    return mod.default ?? mod;
  } catch (err) {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
    return res.json();
  }
}
