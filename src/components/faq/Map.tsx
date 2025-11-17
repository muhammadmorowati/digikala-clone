"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

export default function Map() {
  const markerIcon = L.icon({
    iconUrl: "/faq/marker-icon.svg",
    iconSize: [32, 32],       // GOOD PRACTICE
    iconAnchor: [16, 32],     // Center bottom for proper pin drop
  });

  const position: [number, number] = [
    35.75515294611187,
    51.41220957799119,
  ];

  return (
    <MapContainer
      className="z-0 h-96 w-full rounded-xl overflow-hidden"
      center={position}
      zoom={13}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />

      <Marker position={position} icon={markerIcon} />
    </MapContainer>
  );
}
