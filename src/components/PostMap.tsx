"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MapPin as MapPinIcon } from "lucide-react";
import type { MapPin } from "./LeafletMap";

const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

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

    // Extract name: handles ### **[Name](url)**, ### 1. Name, ### Name
    const nameMatch =
      headingLine.match(/^#{2,3}\s+\*?\*?\[([^\]]+)\]/) ||
      headingLine.match(/^#{2,3}\s+\*?\*?(?:\d+\.\s*🥇?\s*)?([^*\n(]+)/);
    if (!nameMatch) continue;
    const name = nameMatch[1].replace(/\*/g, "").trim();
    if (!name || name.toLowerCase().includes("verdict") || name.toLowerCase().includes("conclusion")) continue;

    // Find address line: contains CO zip or known Denver suburb
    const addrLine = lines.find(l =>
      /\b(Denver|Lakewood|Aurora|Westminster|Englewood|Littleton|Edgewater|Arvada|Wheat Ridge),?\s*(CO|Colorado)\b/.test(l)
    );
    if (!addrLine) continue;

    // Clean address: take everything before | or ( or **
    const address = addrLine
      .split(/[|(]/)[0]
      .replace(/\*+/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
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

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&countrycodes=us`;
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
