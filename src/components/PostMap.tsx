"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MapPin as MapPinIcon } from "lucide-react";
import type { MapPin } from "./LeafletMap";

const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

// Matches a "<City>, CO/Colorado" address fragment within a single segment
// (no pipe between city and state). Used to locate the address line AND, when
// name + address share one line, the specific pipe-segment that is the address.
const CITY_CO =
  /\b(Denver|Lakewood|Aurora|Westminster|Englewood|Littleton|Edgewater|Arvada|Wheat Ridge|Boulder|Golden|Commerce City|Thornton|Northglenn|Centennial|Glendale|Greenwood Village)\b[^|]*?\b(CO|Colorado)\b/;

// Colorado bounding box (lng/lat) for Nominatim, so an ambiguously-named place
// can never resolve to a same-named bar in another state. viewbox is
// left,top,right,bottom; bounded=1 discards anything outside it.
const CO_VIEWBOX = "-109.06,41.003,-102.04,36.99";

// Extract restaurant name + address from markdown content
function parseRestaurants(markdown: string): { name: string; address: string; isTop: boolean }[] {
  const SEP = "\n\n---\n\n";
  const sections = markdown.includes(SEP)
    ? markdown.split(SEP)
    : markdown.split(/\n\n(?=#{2,3}[\s*])/);

  const results: { name: string; address: string; isTop: boolean }[] = [];
  let firstRestaurant = true;

  for (const section of sections) {
    const lines = section.split("\n").map(l => l.trim()).filter(Boolean);
    if (!lines.length) continue;

    // Find heading line with ### or ##
    const headingLine = lines.find(l => /^#{2,3}\s/.test(l));
    if (!headingLine) continue;

    // Extract name, handles all observed heading formats:
    //   ### **[Name](url)**
    //   ### 6. **[Name](url)**
    //   ### 1. Name
    //   ### 🥇 1. Name
    //   ### Name
    const nameMatch =
      headingLine.match(/^#{2,3}\s+(?:\d+\.\s*)?(?:🥇\s*)?\*?\*?\[([^\]]+)\]/) ||
      headingLine.match(/^#{2,3}\s+\*?\*?(?:\d+\.\s*)?(?:🥇\s*)?([^*\n[(]+)/);
    if (!nameMatch) continue;
    const name = nameMatch[1].replace(/\*/g, "").replace(/^\d+\.\s*/, "").trim();
    if (!name || name.toLowerCase().includes("verdict") || name.toLowerCase().includes("conclusion")) continue;

    // Find address line: contains a "<City>, CO" fragment.
    const addrLine = lines.find(l => CITY_CO.test(l));
    if (!addrLine) continue;

    // The address line may be just the address, OR "Name | Street, City, CO ZIP
    // (Hood) | $ | ...". Pick the pipe-segment that actually holds the address,
    // not blindly the first segment (which would be the bar name).
    const segments = addrLine.split("|");
    const addrSegment = segments.find(s => CITY_CO.test(s)) ?? segments[0];

    // Clean: unwrap markdown links, drop the (Neighborhood) parens, strip bold.
    const address = addrSegment
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/\([^)]*\)/g, "")
      .replace(/\*+/g, "")
      .trim();

    if (address.length < 8) continue;
    results.push({ name, address, isTop: firstRestaurant });
    firstRestaurant = false;
  }

  return results;
}

async function geocodeOne(address: string): Promise<{ lat: number; lng: number } | null> {
  const key = `rgd_geo:${address}`;
  try {
    const cached = localStorage.getItem(key);
    if (cached) return JSON.parse(cached);

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&countrycodes=us&viewbox=${CO_VIEWBOX}&bounded=1`;
    const res = await fetch(url, {
      headers: { "User-Agent": "RealGoodDenver/1.0 (realgooddenver.com)" },
    });
    const data = await res.json();
    if (data[0]) {
      const result = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      localStorage.setItem(key, JSON.stringify(result));
      return result;
    }
  } catch {}
  return null;
}

async function geocodeAll(
  places: { name: string; address: string; isTop: boolean }[],
  onPin: (pin: MapPin) => void
) {
  for (const place of places) {
    const coords = await geocodeOne(place.address);
    if (coords) {
      onPin({ ...place, lat: coords.lat, lng: coords.lng });
    }
    // Respect Nominatim rate limit: 1 req/sec
    await new Promise(r => setTimeout(r, 1100));
  }
}

interface Props {
  content: string;
}

export default function PostMap({ content }: Props) {
  const [pins, setPins] = useState<MapPin[]>([]);
  const [loading, setLoading] = useState(true);

  const places = parseRestaurants(content);

  useEffect(() => {
    if (!places.length) { setLoading(false); return; }

    geocodeAll(places, pin => setPins(prev => [...prev, pin])).finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!places.length) return null;

  return (
    <div className="mt-12 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <MapPinIcon className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Find them on the map</h3>
        <span className="text-sm text-muted-foreground">
          {loading && pins.length < places.length
            ? `Loading ${pins.length}/${places.length} spots…`
            : `${pins.length} spot${pins.length !== 1 ? "s" : ""}`}
        </span>
      </div>

      <div
        className="relative rounded-2xl overflow-hidden border border-border"
        style={{ height: 420 }}
      >
        {pins.length > 0 ? (
          <LeafletMap pins={pins} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <div className="w-6 h-6 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
              <span className="text-sm">Locating spots…</span>
            </div>
          </div>
        )}
      </div>

      <p className="mt-2 text-xs text-muted-foreground text-right">
        Orange pin = #1 pick &nbsp;·&nbsp; Blue = rest of the list
      </p>
    </div>
  );
}
