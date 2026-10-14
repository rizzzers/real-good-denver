/**
 * geocode-places.ts
 *
 * Geocodes every address the Best of Denver post maps will show and saves the
 * results to src/data/placeCoords.json, so maps render every pin instantly
 * instead of geocoding in each reader's browser (slow, rate-limited, and
 * Nominatim misses ~1/3 of Denver street addresses).
 *
 * Lookup order: US Census geocoder (best for US street addresses), then
 * Nominatim. Results outside Colorado are rejected.
 *
 * Usage:
 *   npx tsx scripts/geocode-places.ts            # geocode addresses not yet in the file
 *   npx tsx scripts/geocode-places.ts --refresh  # re-geocode everything
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { posts } from "../src/data/posts";
import { parseRestaurants, geocodeQuery } from "../src/lib/postMapPlaces";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const COORDS_FILE = path.join(__dirname, "..", "src", "data", "placeCoords.json");

type Coords = [number, number]; // [lat, lng]

const inColorado = ([lat, lng]: Coords) => lat > 36.99 && lat < 41.003 && lng > -109.06 && lng < -102.04;

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function census(query: string): Promise<Coords | null> {
  const url = `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?benchmark=Public_AR_Current&format=json&address=${encodeURIComponent(query)}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`Census HTTP ${res.status}`);
  const data = await res.json();
  const match = data?.result?.addressMatches?.[0];
  return match ? [match.coordinates.y, match.coordinates.x] : null;
}

async function nominatim(query: string): Promise<Coords | null> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=us&viewbox=-109.06,41.003,-102.04,36.99&bounded=1`;
  const res = await fetch(url, {
    headers: { "User-Agent": "RealGoodDenver/1.0 (realgooddenver.com)" },
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) throw new Error(`Nominatim HTTP ${res.status}`);
  const data = await res.json();
  // Nominatim usage policy: max 1 request/sec
  await sleep(1100);
  return data[0] ? [parseFloat(data[0].lat), parseFloat(data[0].lon)] : null;
}

async function geocode(address: string): Promise<Coords | null> {
  const query = geocodeQuery(address);
  for (const lookup of [census, nominatim]) {
    try {
      const coords = await lookup(query);
      if (coords && inColorado(coords)) return coords;
    } catch (err) {
      console.warn(`[geocode] ${lookup.name} failed for "${query}": ${(err as Error).message}`);
    }
  }
  return null;
}

async function main() {
  const refresh = process.argv.includes("--refresh");
  const existing: Record<string, Coords> =
    !refresh && fs.existsSync(COORDS_FILE) ? JSON.parse(fs.readFileSync(COORDS_FILE, "utf-8")) : {};

  const addresses = [...new Set(posts.flatMap(p => parseRestaurants(p.fullContent).map(pl => pl.address)))].sort();
  const todo = addresses.filter(a => !existing[a]);
  console.log(`[geocode] ${addresses.length} addresses, ${todo.length} to look up`);

  const missed: string[] = [];
  for (const address of todo) {
    const coords = await geocode(address);
    if (coords) existing[address] = [+coords[0].toFixed(6), +coords[1].toFixed(6)];
    else missed.push(address);
  }

  // Drop addresses no longer used by any post; keep keys sorted for clean diffs.
  const keep = new Set(addresses);
  const out = Object.fromEntries(Object.entries(existing).filter(([a]) => keep.has(a)).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(COORDS_FILE, JSON.stringify(out, null, 2) + "\n", "utf-8");

  console.log(`[geocode] ${Object.keys(out).length}/${addresses.length} addresses have coordinates`);
  if (missed.length) console.log(`[geocode] Not found:\n  ${missed.join("\n  ")}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
