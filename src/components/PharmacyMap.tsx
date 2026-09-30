import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CircleMarker, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { AVAILABILITY_LABEL, formatPrice } from "@/lib/utils";
import type { Availability, Coordinates, Pharmacy } from "@/types";

export interface MapMarker {
  pharmacy: Pharmacy;
  price?: number;
  availability?: Availability;
}

const CENTER: Coordinates = { lat: 55.7558, lng: 37.6173 };
const COLOR: Record<Availability | "none", string> = {
  in_stock: "#16a34a", on_order: "#d97706", out_of_stock: "#dc2626", none: "#0d9488",
};

// divIcon вместо картинок по умолчанию: не зависим от путей к ассетам Leaflet и бандлера
const icon = (m: MapMarker) =>
  L.divIcon({
    className: "pharmacy-marker",
    iconSize: [44, 26],
    iconAnchor: [22, 26],
    html: `<div style="background:${COLOR[m.availability ?? "none"]};color:#fff;font:600 12px sans-serif;padding:4px 8px;border-radius:999px;border:2px solid #fff;box-shadow:0 1px 4px #0006;text-align:center;white-space:nowrap">${m.price !== undefined ? `${m.price} ₽` : "＋"}</div>`,
  });

/** Подгоняет область просмотра под все маркеры. */
function FitBounds({ points }: { points: Coordinates[] }) {
  const map = useMap();
  useEffect(() => {
    if (!points.length) return;
    map.fitBounds(L.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number])), { padding: [40, 40], maxZoom: 15 });
  }, [map, points]);
  return null;
}

export default function PharmacyMap({
  markers, user, height = "60vh",
}: { markers: MapMarker[]; user: Coordinates | null; height?: string }) {
  const points = [...markers.map((m) => m.pharmacy.coordinates), ...(user ? [user] : [])];
  return (
    <MapContainer center={[CENTER.lat, CENTER.lng]} zoom={11} scrollWheelZoom style={{ height }} className="z-0 w-full rounded-lg border" aria-label="Карта аптек">
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FitBounds points={points} />
      {user && <CircleMarker center={[user.lat, user.lng]} radius={8} pathOptions={{ color: "#fff", fillColor: "#2563eb", fillOpacity: 1, weight: 3 }}><Popup>Вы здесь</Popup></CircleMarker>}
      {markers.map((m) => (
        <Marker key={m.pharmacy.id} position={[m.pharmacy.coordinates.lat, m.pharmacy.coordinates.lng]} icon={icon(m)} title={m.pharmacy.name}>
          <Popup>
            <strong>{m.pharmacy.name}</strong><br />
            {m.pharmacy.address}<br />
            {m.pharmacy.workingHours} · ★ {m.pharmacy.rating.toFixed(1)}
            {m.price !== undefined && m.availability && (<><br /><b>{formatPrice(m.price)}</b> — {AVAILABILITY_LABEL[m.availability]}</>)}
            {m.price === undefined && (<><br /><Link to="/">Найти лекарство</Link></>)}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
