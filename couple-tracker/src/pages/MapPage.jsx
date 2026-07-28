import { useEffect } from "react";
import "leaflet/dist/leaflet.css"; // BARIS WAJIB UNTUK MENCEGAH PETA PUTIH
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Navigation } from "lucide-react";
import { useLocations } from "../hooks/useLocations";
import { useAuth } from "../contexts/AuthContext";
import { usePartner } from "../hooks/usePartner";

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

// Ikon kustom untuk membedakan marker Anda (Biru)
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

// Ikon kustom untuk Pasangan (Merah)
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

// Komponen helper untuk menggeser peta secara dinamis ke lokasi Anda
const RecenterMap = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.flyTo([location.latitude, location.longitude], 16, { animate: true });

      // Trik untuk memaksa peta melakukan render ulang jika ukuran kontainer berubah
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }
  }, [location, map]);
  return null;
};

export default function MapPage() {
  const { profile } = useAuth();
  const { partner } = usePartner();
  const { myLocation, partnerLocation, isSharing, toggleSharing } =
    useLocations();

  // Koordinat default Mataram NTB
  const defaultCenter = [-8.5833, 116.1167];

  // Penentuan titik pusat awal
  const mapCenter = myLocation
    ? [myLocation.latitude, myLocation.longitude]
    : partnerLocation
      ? [partnerLocation.latitude, partnerLocation.longitude]
      : defaultCenter;

  return (
    <div className="space-y-4 animate-in fade-in duration-500 pt-2 h-[80vh] flex flex-col">
      {/* Header Map */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-blue-100 flex flex-col gap-1 shrink-0">
        <h1 className="text-2xl font-extrabold text-blue-950">Peta Lokasi</h1>
        <p className="text-sm text-blue-800 font-medium">
          Pantau lokasi Anda dan pasangan secara real-time
        </p>
      </div>

      {/* Kontainer Peta: Ditambahkan min-h-[50vh] agar peta tidak menyusut menjadi 0 piksel */}
      <div className="flex-1 min-h-[50vh] relative rounded-3xl overflow-hidden shadow-sm border border-blue-100 z-0">
        {/* Floating Action Bar */}
        <div className="absolute top-4 left-4 right-4 z-[400] flex justify-between items-center gap-2">
          <div className="bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-blue-50">
            <p className="text-sm font-bold text-blue-950">
              Status:{" "}
              {isSharing ? (
                <span className="text-emerald-600">Live 📡</span>
              ) : (
                <span className="text-blue-950/50">Offline</span>
              )}
            </p>
          </div>

          <button
            onClick={toggleSharing}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold shadow-lg transition-all active:scale-95 ${
              isSharing
                ? "bg-red-500 hover:bg-red-600 text-white shadow-red-200"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
            }`}
          >
            <Navigation size={18} />
            {isSharing ? "Hentikan GPS" : "Mulai Bagikan"}
          </button>
        </div>

        {/* Komponen Peta Leaflet */}
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: "100%", width: "100%", zIndex: 1 }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <RecenterMap location={myLocation} />

          {myLocation && (
            <Marker
              position={[myLocation.latitude, myLocation.longitude]}
              icon={myIcon}
            >
              <Popup className="rounded-xl border-0 shadow-xl">
                <div className="text-center font-sans p-1">
                  <p className="font-extrabold text-blue-950 mb-1">
                    {profile?.nama || "Anda"}
                  </p>
                  <p className="text-xs text-blue-800 font-medium">
                    Akurasi: ±{Math.round(myLocation.accuracy)}m
                  </p>
                  <p className="text-xs text-blue-800/70 mt-1">
                    Update:{" "}
                    {new Date(myLocation.updated_at).toLocaleTimeString()}
                  </p>
                </div>
              </Popup>
            </Marker>
          )}

          {partnerLocation && (
            <Marker
              position={[partnerLocation.latitude, partnerLocation.longitude]}
              icon={partnerIcon}
            >
              <Popup className="rounded-xl border-0 shadow-xl">
                <div className="text-center font-sans p-1">
                  <p className="font-extrabold text-red-600 mb-1">
                    {partner?.nama || "Pasangan"}
                  </p>
                  <p className="text-xs text-blue-800 font-medium">
                    Status:{" "}
                    {partnerLocation.is_online ? "Live 🟢" : "Offline ⚪"}
                  </p>
                  <p className="text-xs text-blue-800/70 mt-1">
                    Update:{" "}
                    {new Date(partnerLocation.updated_at).toLocaleTimeString()}
                  </p>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
}
