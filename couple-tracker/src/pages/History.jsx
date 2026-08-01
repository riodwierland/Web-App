import { useState, useEffect } from "react";
import { Clock, MapPin, Navigation, Trash2 } from "lucide-react"; // Menambahkan Trash2
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { supabase } from "../services/supabase";
import { usePartner } from "../hooks/usePartner";
import { toast } from "sonner"; // Untuk notifikasi sukses/gagal

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

  // Fungsi untuk menghapus riwayat
  const handleDeleteHistory = async () => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin menghapus semua riwayat lokasi ini? Data yang dihapus tidak dapat dikembalikan.",
      )
    ) {
      // PERBAIKAN: Tambahkan .select() di akhir
      const { data, error } = await supabase
        .from("location_history")
        .delete()
        .eq("user_id", partner.id)
        .select();

      if (error) {
        toast.error("Terjadi kesalahan sistem saat menghapus riwayat.");
        console.error(error);
      } else if (data && data.length === 0) {
        // Jika berhasil diakses tapi tidak ada yang terhapus (terhalang RLS)
        toast.error(
          "Gagal menghapus! Akses ditolak oleh keamanan database (RLS).",
        );
      } else {
        toast.success("Riwayat lokasi berhasil dihapus.");
        setHistory([]);
      }
    }
  };

  // Tampilan ketika belum ada pasangan
  if (!partner) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4 animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-sky-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-5 shadow-inner border border-sky-200 dark:border-slate-700 transition-colors duration-300">
          <MapPin size={32} className="text-blue-500 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-extrabold text-blue-950 dark:text-sky-50 mb-2 transition-colors duration-300">
          Belum Ada Pasangan
        </h2>
        <p className="text-sky-700 dark:text-slate-400 text-sm leading-relaxed max-w-xs transition-colors duration-300">
          Hubungkan pasangan Anda di menu Profil untuk mulai melihat riwayat
          lokasinya di sini.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6 animate-in fade-in duration-500 pt-2">
      {/* Kartu Header dengan Tombol Hapus */}
      <div className="bg-sky-50 dark:bg-slate-900 p-5 rounded-3xl shadow-[0_8px_30px_rgba(14,165,233,0.15)] dark:shadow-none border border-sky-100 dark:border-slate-800 mb-6 flex justify-between items-center transition-colors duration-300">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-extrabold text-blue-950 dark:text-sky-50">
            Riwayat Lokasi
          </h1>
          <p className="text-sm text-sky-700 dark:text-slate-400 font-medium">
            24 Jam Terakhir •{" "}
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              {partner.nama}
            </span>
          </p>
        </div>

        {/* Tombol Hapus Riwayat */}
        {history.length > 0 && (
          <button
            onClick={handleDeleteHistory}
            className="p-3 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl border border-red-200 dark:border-red-500/20 hover:bg-red-200 dark:hover:bg-red-500/20 transition-all active:scale-90 shadow-sm"
            title="Hapus Semua Riwayat"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 bg-sky-50 dark:bg-slate-900 rounded-3xl border border-sky-100 dark:border-slate-800 shadow-[0_8px_30px_rgba(14,165,233,0.15)] dark:shadow-none"
            ></div>
          ))}
        </div>
      ) : history.length === 0 ? (
        <div className="text-center text-sky-700 dark:text-slate-400 py-12 bg-sky-50 dark:bg-slate-900 rounded-3xl border border-sky-100 dark:border-slate-800 shadow-[0_8px_30px_rgba(14,165,233,0.15)] dark:shadow-none text-sm font-medium transition-colors duration-300">
          Belum ada data riwayat lokasi yang terekam.
        </div>
      ) : (
        <div className="relative border-l-2 border-sky-200 dark:border-slate-800 ml-5 space-y-8 pb-8 transition-colors duration-300">
          {history.map((loc) => (
            <div key={loc.id} className="relative pl-7 group">
              {/* Timeline Dot */}
              <div className="absolute -left-[11px] top-1.5 w-5 h-5 bg-sky-50 dark:bg-slate-950 border-[5px] border-blue-500 dark:border-blue-500 rounded-full group-hover:scale-110 transition-transform"></div>

              {/* Kartu Riwayat Per Item */}
              <div className="bg-sky-50 dark:bg-slate-900 p-5 rounded-3xl border border-sky-100 dark:border-slate-800 shadow-[0_8px_30px_rgba(14,165,233,0.15)] dark:shadow-none hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-2 text-sm font-bold text-blue-950 dark:text-sky-50 mb-3">
                  <Clock
                    size={16}
                    className="text-blue-500 dark:text-blue-400"
                  />
                  {format(new Date(loc.created_at), "HH:mm - dd MMM yyyy", {
                    locale: id,
                  })}
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  {/* Kotak Kecepatan */}
                  <div className="bg-sky-100/60 dark:bg-slate-800/50 p-3 rounded-2xl flex flex-col gap-1 border border-sky-200 dark:border-slate-700 transition-colors duration-300">
                    <div className="flex items-center gap-1.5 text-sky-600 dark:text-slate-400">
                      <Navigation size={14} />
                      <span className="text-[10px] uppercase tracking-wider font-bold">
                        Kecepatan
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-blue-950 dark:text-sky-100">
                      {loc.speed
                        ? `${Math.round(loc.speed * 3.6)} km/j`
                        : "Diam"}
                    </span>
                  </div>

                  {/* Kotak Akurasi */}
                  <div className="bg-sky-100/60 dark:bg-slate-800/50 p-3 rounded-2xl flex flex-col gap-1 border border-sky-200 dark:border-slate-700 transition-colors duration-300">
                    <div className="flex items-center gap-1.5 text-sky-600 dark:text-slate-400">
                      <MapPin size={14} />
                      <span className="text-[10px] uppercase tracking-wider font-bold">
                        Akurasi
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-blue-950 dark:text-sky-100">
                      ± {Math.round(loc.accuracy)} meter
                    </span>
                  </div>
                </div>

                {/* Tombol Maps */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${loc.latitude},${loc.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 dark:bg-blue-600 text-sky-50 rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
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
