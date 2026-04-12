import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import LocationIcon from "~icons/material-symbols/location-on";
import { renderToString } from "react-dom/server";

const LNG = 17.7135502;
const LAT = 59.6224415;
const ZOOM = 15;
const STYLE = "https://tiles.openfreemap.org/styles/positron";

export const ContactMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: STYLE,
      center: [LNG, LAT],
      zoom: ZOOM,
      attributionControl: false,
      cooperativeGestures: true,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    const markerEl = document.createElement("div");
    markerEl.className =
      "flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-xl";
    markerEl.innerHTML = renderToString(
      <LocationIcon className="text-primary text-3xl" />,
    );

    new maplibregl.Marker({ element: markerEl })
      .setLngLat([LNG, LAT])
      .addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="relative h-100 overflow-hidden rounded-xl">
      <div ref={mapContainer} className="h-full w-full" />
      <div className="absolute right-6 bottom-6 left-6 rounded-lg bg-white/40 p-6 shadow backdrop-blur-xs">
        <p className="font-headline text-on-surface font-bold">
          Vårt huvudkontor
        </p>
        <p className="text-on-surface-variant text-sm">
          Ormbergsvägen 15, 193 36 Sigtuna
        </p>
      </div>
    </div>
  );
};
