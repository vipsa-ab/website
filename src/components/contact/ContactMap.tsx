import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import LocationIcon from "~icons/material-symbols/location-on";
import { renderToString } from "react-dom/server";

import { PUBLIC_MAPBOX_TOKEN } from "astro:env/client";

const LNG = 17.7135502;
const LAT = 59.6224415;
const ZOOM = 15;

export const ContactMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    mapboxgl.accessToken = PUBLIC_MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [LNG, LAT],
      zoom: ZOOM,
      attributionControl: false,
      cooperativeGestures: true,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    const markerEl = document.createElement("div");
    markerEl.className =
      "flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-xl";
    markerEl.innerHTML = renderToString(
      <LocationIcon className="text-primary text-3xl" />,
    );

    new mapboxgl.Marker({ element: markerEl }).setLngLat([LNG, LAT]).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="relative h-100 overflow-hidden rounded-xl">
      <div ref={mapContainer} className="h-107 w-full" />
      <div className="absolute right-6 bottom-6 left-6 rounded-lg bg-white/90 p-6 backdrop-blur-md">
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
