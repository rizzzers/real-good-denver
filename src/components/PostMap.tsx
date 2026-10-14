"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MapPin as MapPinIcon } from "lucide-react";
import type { MapPin } from "./LeafletMap";
import { parseRestaurants, geocodeQuery, CO_VIEWBOX } from "@/lib/postMapPlaces";
// Precomputed by scripts/geocode-places.ts, keyed by address: [lat, lng]
import placeCoords from "@/data/placeCoords.json";

const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

type Place = { name: string; address: string; isTop: boolean };

const savedCoords: Record<string, number[]> = placeCoords;

// Live fallback for addresses not yet in placeCoords.json (e.g. a post published
// before the geocode script ran). Cached per browser.
async function geocodeLive(address: string): Promise<{ lat: number; lng: number } | null> {
  const key = `rgd_geo2:${address}`;
  try {
    const cached = localStorage.getItem(key);
    if (cached) return JSON.parse(cached);

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(geocodeQuery(address))}&format=json&limit=1&countrycodes=us&viewbox=${CO_VIEWBOX}&bounded=1`;
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

async function geocodeMissing(places: Place[], onPin: (pin: MapPin) => void) {
  for (const place of places) {
    const coords = await geocodeLive(place.address);
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
  const places = parseRestaurants(content);
  const missing = places.filter(p => !savedCoords[p.address]);

  const [pins, setPins] = useState<MapPin[]>(() =>
    places
      .filter(p => savedCoords[p.address])
      .map(p => ({ ...p, lat: savedCoords[p.address][0], lng: savedCoords[p.address][1] }))
  );
  const [loading, setLoading] = useState(missing.length > 0);

  useEffect(() => {
    if (!missing.length) return;

    geocodeMissing(missing, pin => setPins(prev => [...prev, pin])).finally(() => setLoading(false));
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
