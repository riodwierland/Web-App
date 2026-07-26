import { useState, useEffect } from "react";
import { Clock, MapPin, Navigation } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { supabase } from "../services/supabase";
import { usePartner } from "../hooks/usePartner";

export default function History() {
  const { partner } = usePartner();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!partner) {
        setIsLoading(false);
        return;
      }

      // Ambil riwayat lokasi 24 jam terakhir
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const { data, error } = await supabase
        .from("location_history")
        .select("*")
        .eq("user_id", partner.id)
        .gte("created_at", yesterday.toISOString())
        .order("created_at", { ascending: false })
        .limit(50); // Batasi 50 titik terakhir agar tidak berat

      if (!error && data) {
        setHistory(data);
      }
      setIsLoading(false);
    };

    fetchHistory();
  }, [partner]);

  if (!partner) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4 animate-in fade-in">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <MapPin size={24} className="text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Belum Ada Pasangan
        </h2>
        <p className="text-gray-500 text-sm">
          Hubungkan pasangan Anda di menu Profil untuk melihat riwayat
          lokasinya.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Riwayat Lokasi
          </h1>
          <p className="text-sm text-gray-500">
            24 Jam Terakhir: {partner.nama}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border"
            ></div>
          ))}
        </div>
      ) : history.length === 0 ? (
        <div className="text-center text-gray-500 py-10 bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-dark-border">
          Belum ada data riwayat lokasi yang terekam.
        </div>
      ) : (
        <div className="relative border-l-2 border-blue-100 dark:border-blue-900/30 ml-4 space-y-6">
          {history.map((loc) => (
            <div key={loc.id} className="relative pl-6">
              {/* Timeline Dot */}
              <div className="absolute -left-[9px] top-1 w-4 h-4 bg-white dark:bg-dark-bg border-4 border-blue-500 rounded-full"></div>

              <div className="bg-white dark:bg-dark-card p-4 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  <Clock size={16} className="text-blue-500" />
                  {format(new Date(loc.created_at), "HH:mm - dd MMM yyyy", {
                    locale: id,
                  })}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-xl flex items-center gap-2">
                    <Navigation size={14} className="text-gray-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      {loc.speed
                        ? `${Math.round(loc.speed * 3.6)} km/jam`
                        : "Diam"}
                    </span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-xl flex items-center gap-2">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      ±{Math.round(loc.accuracy)}m
                    </span>
                  </div>
                </div>

                {/* Link ke Google Maps untuk navigasi presisi */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${loc.latitude},${loc.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 block text-center text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline"
                >
                  Buka di Google Maps
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
