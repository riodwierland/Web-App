import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Navigation, LocateFixed } from "lucide-react"; // Menambahkan ikon LocateFixed
import { useLocations } from "../hooks/useLocations";
import { useAuth } from "../contexts/AuthContext";
import { usePartner } from "../hooks/usePartner";

// Konfigurasi Ikon Bawaan Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

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

export default function MapPage() {
  const { profile } = useAuth();
  const { partner } = usePartner();
  const { myLocation, partnerLocation, isSharing, toggleSharing } =
    useLocations();
  const [localPos, setLocalPos] = useState(null);

  // State untuk mengontrol peta secara manual
  const [map, setMap] = useState(null);
  const [hasCenteredInitially, setHasCenteredInitially] = useState(false);

  // Mengambil posisi lokal agar marker kita tetap jalan secara halus di layar kita sendiri
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setLocalPos({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            updated_at: new Date().toISOString(),
          });
        },
        (err) => console.warn("Gagal mengambil lokasi:", err.message),
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 5000 },
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  const displayLocation = myLocation || localPos;
  const defaultCenter = [-8.5833, 116.1167]; // Mataram

  // Tentukan titik tengah hanya untuk inisialisasi awal
  const mapCenter = displayLocation
    ? [displayLocation.latitude, displayLocation.longitude]
    : partnerLocation
      ? [partnerLocation.latitude, partnerLocation.longitude]
      : defaultCenter;

  // Efek: Hanya kunci kamera ke lokasi pengguna pada SAAT PERTAMA KALI lokasi ditemukan
  useEffect(() => {
    if (map && displayLocation && !hasCenteredInitially) {
      // PERBAIKAN: Mengubah animate menjadi true dan menambahkan durasi (1.5 detik)
      map.flyTo([displayLocation.latitude, displayLocation.longitude], 16, {
        animate: true,
        duration: 1.5,
      });
      setHasCenteredInitially(true);
    }
  }, [map, displayLocation, hasCenteredInitially]);

  // Fungsi untuk tombol "Cari Lokasi Saya"
  const centerToMyLocation = () => {
    if (map && displayLocation) {
      map.flyTo([displayLocation.latitude, displayLocation.longitude], 16, {
        animate: true,
        duration: 1.5,
      });
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500 pt-2 h-[80vh] flex flex-col">
      {/* Header Map */}
      <div className="bg-sky-50 dark:bg-slate-900 p-5 rounded-3xl shadow-[0_4px_20px_rgba(14,165,233,0.15)] dark:shadow-none border border-sky-200 dark:border-slate-800 flex flex-col gap-1 shrink-0 transition-colors duration-300">
        <h1 className="text-2xl font-extrabold text-blue-950 dark:text-sky-50">
          Peta Lokasi
        </h1>
        <p className="text-sm text-sky-700 dark:text-slate-400 font-semibold">
          Pantau lokasi Anda dan pasangan secara real-time
        </p>
      </div>

      {/* Kontainer Peta */}
      <div className="flex-1 min-h-[50vh] relative rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(14,165,233,0.2)] dark:shadow-none border-2 border-sky-200 dark:border-slate-800 z-0 bg-sky-100 dark:bg-slate-900 transition-colors duration-300">
        {/* Kontainer Tombol Atas */}
        <div className="absolute top-4 left-4 right-4 z-[400] flex justify-between items-center gap-2 pointer-events-none">
          <div className="bg-sky-50/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-sky-200 dark:border-slate-700 transition-colors duration-300 pointer-events-auto">
            <p className="text-sm font-bold text-blue-950 dark:text-sky-50">
              Status:{" "}
              {isSharing ? (
                <span className="text-emerald-600 dark:text-emerald-400">
                  Live 📡
                </span>
              ) : (
                <span className="text-sky-700/80 dark:text-slate-500">
                  Offline
                </span>
              )}
            </p>
          </div>

          <button
            onClick={toggleSharing}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold shadow-lg transition-all active:scale-95 pointer-events-auto ${
              isSharing
                ? "bg-red-500 hover:bg-red-600 text-white shadow-red-200 dark:shadow-none"
                : "bg-blue-600 hover:bg-blue-700 text-sky-50 shadow-blue-300 dark:shadow-none"
            }`}
          >
            <Navigation size={18} />
            {isSharing ? "Hentikan GPS" : "Mulai Bagikan"}
          </button>
        </div>

        {/* Tombol Locate Me (Fokus ke lokasi saya) */}
        <button
          onClick={centerToMyLocation}
          className="absolute bottom-6 right-4 z-[400] bg-white dark:bg-slate-800 p-3.5 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.15)] border border-sky-100 dark:border-slate-700 text-blue-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-slate-700 transition-all active:scale-90"
          title="Fokus ke lokasi saya"
        >
          <LocateFixed size={22} strokeWidth={2.5} />
        </button>

        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: "100%", width: "100%", zIndex: 1 }}
          zoomControl={false}
          ref={setMap} // Menyimpan instance peta ke state
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Hapus komponen <RecenterMap /> yang lama karena sekarang dikontrol manual */}

          {displayLocation && (
            <Marker
              position={[displayLocation.latitude, displayLocation.longitude]}
              icon={myIcon}
            >
              <Popup className="rounded-xl border-0 shadow-xl">
                <div className="text-center font-sans p-1">
                  <p className="font-extrabold text-blue-950 mb-1">
                    {profile?.nama || "Anda"}
                  </p>
                  <p className="text-xs text-sky-700 font-medium">
                    Akurasi: ±{Math.round(displayLocation.accuracy)}m
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
                  <p className="text-xs text-sky-700 font-medium">
                    Status:{" "}
                    {partnerLocation.is_online ? "Live 🟢" : "Offline ⚪"}
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
