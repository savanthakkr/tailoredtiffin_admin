'use client';

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useSession } from "next-auth/react";

const containerStyle = {
  width: "100%",
  height: "90vh",
};

const DEFAULT_CENTER = {
  lat: 22.9734,
  lng: 78.6569, // India
};

export default function OrdersMapPage() {

  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const mapRef = useRef(null);

  const date = searchParams.get("date");
  const slot = searchParams.get("slot");

  const [locations, setLocations] = useState([]);

  /* =============================
     FETCH ORDER LOCATIONS
  ============================= */
  const fetchLocations = async () => {
    const res = await fetch(
      `https://api.tailoredtiffin.com//admin/get_all_order_locations?date=${date}&slot=${slot}`,
      {
        headers: {
          Authorization: session?.accessToken
        }
      }
    );

    const json = await res.json();
    if (json.status === "success") {
      setLocations(json.data);
    }
  };

  useEffect(() => {
  if (!mapRef.current || locations.length === 0) return;

  const bounds = new window.google.maps.LatLngBounds();

  locations.forEach(l => {
    bounds.extend({
      lat: Number(l.latitude),
      lng: Number(l.longitude),
    });
  });

  mapRef.current.fitBounds(bounds);

}, [locations]);

  useEffect(() => {
    if (!session?.accessToken) return;
    fetchLocations();
  }, [session, date, slot]);

  /* =============================
     AUTO FIT WHEN DATA CHANGES
  ============================= */
  useEffect(() => {
    if (!mapRef.current || locations.length === 0) return;

    const bounds = new window.google.maps.LatLngBounds();

    locations.forEach(l => {
      bounds.extend({
        lat: Number(l.latitude),
        lng: Number(l.longitude),
      });
    });

    mapRef.current.fitBounds(bounds);

  }, [locations]);

  return (
    <div>
      <h3 style={{ padding: 10 }}>
        Orders Location Map ({locations.length})
      </h3>

      <LoadScript googleMapsApiKey="AIzaSyBt6Xd9sSZXYZr8t_tQTFYUaIeRnHKXJ90">
        <GoogleMap
    mapContainerStyle={containerStyle}
    center={DEFAULT_CENTER}
    zoom={5}
    onLoad={(map) => {
      mapRef.current = map;

      if (locations.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();

        locations.forEach(l => {
          bounds.extend({
            lat: Number(l.latitude),
            lng: Number(l.longitude),
          });
        });

        map.fitBounds(bounds);
      }
    }}
  >

    {locations.map((l, i) => (
      <Marker
        key={i}
        position={{
          lat: Number(l.latitude),
          lng: Number(l.longitude),
        }}
        icon="https://maps.google.com/mapfiles/ms/icons/red-dot.png"
      />
    ))}

  </GoogleMap>
      </LoadScript>
    </div>
  );
}
