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

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const { data, error } = await supabase
        .from("location_history")
        .select("*")
        .eq("user_id", partner.id)
        .gte("created_at", yesterday.toISOString())
        .order("created_at", { ascending: false })
        .limit(50);

      if (!error && data) {
        setHistory(data);
      }
      setIsLoading(false);
    };

    fetchHistory();
  }, [partner]);

  if (!partner) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4 animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-5 shadow-inner">
          <MapPin size={32} className="text-indigo-300" />
        </div>
        <h2 className="text-2xl font-extrabold text-zinc-900 mb-2">
          Belum Ada Pasangan
        </h2>
        <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
          Hubungkan pasangan Anda di menu Profil untuk mulai melihat riwayat
          lokasinya di sini.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6 animate-in fade-in duration-500 pt-2">
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-zinc-100 mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold text-zinc-900">
          Riwayat Lokasi
        </h1>
        <p className="text-sm text-zinc-500 font-medium">
          24 Jam Terakhir •{" "}
          <span className="text-indigo-600 font-semibold">{partner.nama}</span>
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 bg-white rounded-3xl border border-zinc-100 shadow-sm"
            ></div>
          ))}
        </div>
      ) : history.length === 0 ? (
        <div className="text-center text-zinc-500 py-12 bg-white rounded-3xl border border-zinc-100 shadow-sm text-sm font-medium">
          Belum ada data riwayat lokasi yang terekam.
        </div>
      ) : (
        <div className="relative border-l-2 border-indigo-100 ml-5 space-y-8 pb-8">
          {history.map((loc) => (
            <div key={loc.id} className="relative pl-7 group">
              {/* Timeline Dot */}
              <div className="absolute -left-11px top-1.5 w-5 h-5 bg-zinc-50 border-[5px] border-indigo-500 rounded-full group-hover:scale-110 transition-transform"></div>

              <div className="bg-white p-5 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 mb-3">
                  <Clock size={16} className="text-indigo-500" />
                  {format(new Date(loc.created_at), "HH:mm - dd MMM yyyy", {
                    locale: id,
                  })}
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="bg-zinc-50 p-3 rounded-2xl flex flex-col gap-1 border border-zinc-100/50">
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <Navigation size={14} />
                      <span className="text-[10px] uppercase tracking-wider font-bold">
                        Kecepatan
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-zinc-700">
                      {loc.speed
                        ? `${Math.round(loc.speed * 3.6)} km/j`
                        : "Diam"}
                    </span>
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-2xl flex flex-col gap-1 border border-zinc-100/50">
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <MapPin size={14} />
                      <span className="text-[10px] uppercase tracking-wider font-bold">
                        Akurasi
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-zinc-700">
                      ± {Math.round(loc.accuracy)} meter
                    </span>
                  </div>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${loc.latitude},${loc.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors"
                >
                  <MapPin size={14} />
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
