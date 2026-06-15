"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MapPin {
  name: string;
  address: string;
  lat: number;
  lng: number;
  isTop?: boolean;
}

// Custom marker using DivIcon so we don't need image assets
function makeIcon(isTop: boolean) {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width:${isTop ? 18 : 13}px;
        height:${isTop ? 18 : 13}px;
        background:${isTop ? "#f97316" : "#3b82f6"};
        border:2px solid #fff;
        border-radius:50%;
        box-shadow:0 0 0 ${isTop ? 3 : 2}px ${isTop ? "rgba(249,115,22,0.45)" : "rgba(59,130,246,0.35)"}, 0 2px 8px rgba(0,0,0,0.5);
      "></div>`,
    iconSize: [isTop ? 18 : 13, isTop ? 18 : 13],
    iconAnchor: [isTop ? 9 : 6, isTop ? 9 : 6],
    popupAnchor: [0, isTop ? -12 : -9],
  });
}

function FitBounds({ pins }: { pins: MapPin[] }) {
  const map = useMap();
  useEffect(() => {
    if (pins.length === 0) return;
    if (pins.length === 1) {
      map.setView([pins[0].lat, pins[0].lng], 14);
    } else {
      const bounds = L.latLngBounds(pins.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [map, pins]);
  return null;
}

export default function LeafletMap({ pins }: { pins: MapPin[] }) {
  if (pins.length === 0) return null;

  const center: [number, number] = [pins[0].lat, pins[0].lng];

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "100%", width: "100%", background: "#1a1a2e" }}
      zoomControl={true}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={19}
      />
      <FitBounds pins={pins} />
      {pins.map((pin, i) => (
        <Marker key={i} position={[pin.lat, pin.lng]} icon={makeIcon(!!pin.isTop)}>
          <Popup minWidth={180}>
            <b style={{ display: "block", fontSize: 14, color: "#111", marginBottom: 4 }}>{pin.name}</b>
            {pin.isTop && (
              <span style={{ display: "inline-block", background: "linear-gradient(90deg,#f97316,#f59e0b)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 99, marginBottom: 5 }}>
                #1 Pick
              </span>
            )}
            <span style={{ display: "block", fontSize: 12, color: "#555", marginBottom: 7 }}>{pin.address}</span>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pin.name + " " + pin.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 12, color: "#1d6ff5", fontWeight: 600 }}
            >
              Open in Google Maps →
            </a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
