"use client";
import { useCallback, useRef } from "react";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";

const TBILISI = { lat: 41.7151, lng: 44.8271 };

const CONTAINER_STYLE = {
  width: "100%",
  height: "280px",
  borderRadius: "14px",
};

const MAP_OPTIONS: google.maps.MapOptions = {
  streetViewControl: false,
  fullscreenControl: true,
  mapTypeControl: true,
  clickableIcons: false,
};

interface Props {
  lat: number | null;
  lng: number | null;
  onPick: (
    location: { lat: number; lng: number },
    formattedAddress: string,
  ) => void;
}

export default function AddressMap({ lat, lng, onPick }: Props) {
  const { t } = useClientTranslation("pages");
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const { isLoaded, loadError } = useJsApiLoader({
    id: "khelovani-google-map",
    googleMapsApiKey: apiKey,
  });
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  const resolve = useCallback(
    (location: { lat: number; lng: number }) => {
      if (!geocoderRef.current) {
        geocoderRef.current = new google.maps.Geocoder();
      }
      geocoderRef.current.geocode({ location }, (results, status) => {
        const formatted =
          status === "OK" && results?.[0] ? results[0].formatted_address : "";
        onPick(location, formatted);
      });
    },
    [onPick],
  );

  const handleClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      resolve({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    },
    [resolve],
  );

  if (!apiKey) {
    return (
      <div className="address-map address-map--message">
        {t("profile.addresses.map_no_key") ||
          "რუკის API გასაღები არ არის კონფიგურირებული"}
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="address-map address-map--message">
        {t("profile.addresses.map_error") || "რუკის ჩატვირთვა ვერ მოხერხდა"}
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="address-map address-map--message">
        <span className="spinner" />
      </div>
    );
  }

  const marker = lat != null && lng != null ? { lat, lng } : null;

  return (
    <GoogleMap
      mapContainerStyle={CONTAINER_STYLE}
      center={marker ?? TBILISI}
      zoom={marker ? 16 : 12}
      onClick={handleClick}
      options={MAP_OPTIONS}
    >
      {marker && (
        <MarkerF
          position={marker}
          draggable
          onDragEnd={(e) => {
            if (e.latLng) {
              resolve({ lat: e.latLng.lat(), lng: e.latLng.lng() });
            }
          }}
        />
      )}
    </GoogleMap>
  );
}
