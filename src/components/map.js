import * as React from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

// Updated pin graphic
import pin from "../images/pin.png";

// Location data
import locationData from "../data/locations.json";

const Map = () => {
  // Use `null` default values to address issue with Leaflet imports and Webpack
  let pinIcon = null;
  let mapBounds = null;
  if (typeof window !== "undefined") {
    // Create a new pin icon if the window is defined
    pinIcon = L.icon({
      iconUrl: pin,
      iconSize: [30, 30],
    });

    // Setup map bounds
    mapBounds = L.latLngBounds(L.latLng(-90, -200),  L.latLng(90, 200));
  }

  return (
    <MapContainer style={{ height: "400px" }} center={[38.653253, -90.4082702]} zoom={2} scrollWheelZoom={false} maxBoundsViscosity={1.0} maxBounds={mapBounds}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {
        locationData.locations.map((location) => {
          return (
            <Marker key={location.name} position={[location.lat, location.long]} icon={pinIcon}>
              <Popup>
                <p style={{ fontWeight: "bold" }}>{location.name}</p>
              </Popup>
            </Marker>
          )
        })
      }

    </MapContainer>
  );
}

export default Map;
