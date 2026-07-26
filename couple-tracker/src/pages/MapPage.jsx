import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Navigation, Focus } from "lucide-react";
import { useLocations } from "../hooks/useLocations";
import { useAuth } from "../contexts/AuthContext";
import { usePartner } from "../hooks/usePartner";
import Button from "../components/ui/Button";

// Fix untuk masalah ikon default Leaflet di React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Ikon kustom untuk membedakan marker
const myIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const partnerIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Komponen helper untuk menggeser peta secara dinamis
const RecenterMap = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.flyTo([location.latitude, location.longitude], 16, { animate: true });
    }
  }, [location, map]);
  return null;
};

export default function MapPage() {
  const { profile } = useAuth();
  const { partner } = usePartner();
  const { myLocation, partnerLocation, isSharing, toggleSharing } =
    useLocations();

  // Koordinat default: Mataram, NTB
  const defaultCenter = [-8.5833, 116.1167];

  // Penentuan titik pusat awal
  const mapCenter = myLocation
    ? [myLocation.latitude, myLocation.longitude]
    : partnerLocation
      ? [partnerLocation.latitude, partnerLocation.longitude]
      : defaultCenter;

  return (
    <div className="relative h-[calc(100vh-100px)] rounded-3xl overflow-hidden shadow-xl border border-gray-200 dark:border-dark-border z-0">
      {/* Floating Action Bar */}
      <div className="absolute top-4 left-4 right-4 z-400 flex justify-between items-center gap-2">
        <div className="bg-white/90 dark:bg-dark-card/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-white/20">
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            Status:{" "}
            {isSharing ? (
              <span className="text-blue-500">Live 📡</span>
            ) : (
              <span className="text-gray-500">Offline</span>
            )}
          </p>
        </div>

        <Button
          onClick={toggleSharing}
          variant={isSharing ? "danger" : "primary"}
          className="w-auto px-4 py-2 rounded-2xl text-sm"
        >
          <Navigation size={18} />
          {isSharing ? "Hentikan GPS" : "Mulai Bagikan"}
        </Button>
      </div>

      {/* Komponen Peta Leaflet */}
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Helper untuk fokus kamera */}
        <RecenterMap location={myLocation} />

        {/* Marker Diri Sendiri */}
        {myLocation && (
          <Marker
            position={[myLocation.latitude, myLocation.longitude]}
            icon={myIcon}
          >
            <Popup className="rounded-xl">
              <div className="text-center font-sans">
                <p className="font-bold text-blue-600 mb-1">
                  {profile?.nama} (Anda)
                </p>
                <p className="text-xs text-gray-500">
                  Akurasi: ±{Math.round(myLocation.accuracy)}m
                </p>
                <p className="text-xs text-gray-500">
                  Update: {new Date(myLocation.updated_at).toLocaleTimeString()}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Marker Pasangan */}
        {partnerLocation && (
          <Marker
            position={[partnerLocation.latitude, partnerLocation.longitude]}
            icon={partnerIcon}
          >
            <Popup>
              <div className="text-center font-sans">
                <p className="font-bold text-red-600 mb-1">{partner?.nama}</p>
                <p className="text-xs text-gray-500">
                  Status: {partnerLocation.is_online ? "Live 🟢" : "Offline ⚪"}
                </p>
                <p className="text-xs text-gray-500">
                  Update:{" "}
                  {new Date(partnerLocation.updated_at).toLocaleTimeString()}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
