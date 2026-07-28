import { Link } from "react-router-dom";
import { MapPin, Heart, Share2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/ui/Button";
import { usePartner } from "../hooks/usePartner";

export default function Dashboard() {
  const { profile } = useAuth();
  const { partner, isLoadingPartner } = usePartner();
  const navigate = useNavigate();

  // Placeholder untuk status koneksi (akan diimplementasikan di Tahap 4)
  const isConnected = !!partner;

  return (
    <div className="space-y-6">
      {/* Header Profile */}
      <div className="bg-white dark:bg-dark-card p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-dark-border flex items-center gap-4">
        <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold">
          {profile?.nama?.charAt(0).toUpperCase() || "U"}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Halo, {profile?.nama || "User"}!
          </h2>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
          </p>
        </div>
      </div>

      {/* Connection Status Card */}
      <div className="bg-linear-to-br from-primary-500 to-primary-600 rounded-3xl p-6 text-white shadow-lg shadow-primary-500/30 relative overflow-hidden">
        {/* Dekorasi Glassmorphism */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-primary-100 text-sm font-medium mb-1">
                Status Pasangan
              </p>
              <h3 className="text-2xl font-bold flex items-center gap-2">
                {isConnected ? "Terhubung" : "Belum Terhubung"}{" "}
                <Heart
                  size={20}
                  className={
                    isConnected
                      ? "fill-red-500 text-red-500 animate-pulse-slow"
                      : "text-white/50"
                  }
                />
              </h3>
            </div>
          </div>

          {!isConnected ? (
            <p className="text-sm text-primary-100 mb-4">
              Bagikan kode Anda atau masukkan kode pasangan untuk mulai berbagi
              lokasi.
            </p>
          ) : (
            <p className="text-sm text-primary-100 mb-4">
              Menerima update lokasi secara real-time.
            </p>
          )}

          <Button
            variant="secondary"
            className="w-auto px-6 py-2 rounded-full text-sm font-bold"
            onClick={() => navigate("/profile")}
          >
            {isConnected ? "Lihat Profil Pasangan" : "Hubungkan Sekarang"}
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => navigate("/map")}
          className="bg-white dark:bg-dark-card p-4 rounded-3xl border border-gray-100 dark:border-dark-border flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform"
        >
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center">
            <MapPin size={24} />
          </div>
          <span className="font-medium text-gray-800 dark:text-gray-200">
            Buka Peta
          </span>
        </button>

        <button className="bg-white dark:bg-dark-card p-4 rounded-3xl border border-gray-100 dark:border-dark-border flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform opacity-70">
          <div className="w-12 h-12 bg-purple-50 dark:bg-purple-500/10 text-purple-500 rounded-full flex items-center justify-center">
            <Share2 size={24} />
          </div>
          <span className="font-medium text-gray-800 dark:text-gray-200">
            Riwayat
          </span>
        </button>
      </div>
    </div>
  );
}
