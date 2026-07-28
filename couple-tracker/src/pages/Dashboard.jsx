import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { usePartner } from "../hooks/usePartner";

export default function Dashboard() {
  const { profile } = useAuth();
  const { partner } = usePartner();
  const isConnected = !!partner;

  return (
    <div className="flex flex-col gap-5 pt-2 animate-in fade-in duration-500">
      {/* Kartu Header Profile */}
      <div className="bg-sky-50 dark:bg-slate-900 p-5 rounded-3xl shadow-[0_4px_20px_rgba(14,165,233,0.15)] dark:shadow-none border border-sky-100 dark:border-slate-800 flex items-center justify-between transition-colors duration-300">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-sky-200 dark:bg-slate-800 text-blue-800 dark:text-sky-400 rounded-2xl flex items-center justify-center font-extrabold text-xl shadow-inner border border-sky-300 dark:border-slate-700">
            {profile?.nama?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="font-bold text-blue-950 dark:text-sky-50 text-lg">
              Halo, {profile?.nama || "User"}!
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs text-sky-700 dark:text-slate-400 font-semibold tracking-wide">
                Online
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Kartu Utama (Status Pasangan) */}
      <div className="bg-sky-50 dark:bg-slate-900 rounded-3xl p-7 shadow-[0_8px_30px_rgba(14,165,233,0.2)] dark:shadow-none border border-sky-200 dark:border-slate-800 flex flex-col items-center text-center mt-2 relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 rounded-full bg-sky-200/50 dark:bg-slate-800/50 blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-32 h-32 rounded-full bg-sky-200/50 dark:bg-slate-800/50 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 w-full">
          <span className="inline-block px-3 py-1 bg-sky-100 dark:bg-slate-800 text-sky-700 dark:text-slate-400 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 border border-sky-200 dark:border-slate-700">
            Status Pasangan
          </span>

          <h2 className="text-3xl font-extrabold text-blue-950 dark:text-sky-50 mb-3 flex items-center justify-center gap-3">
            {isConnected ? "Terhubung" : "Belum Terhubung"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill={isConnected ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={
                isConnected
                  ? "text-red-500"
                  : "text-sky-300 dark:text-slate-600"
              }
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </h2>

          <p className="text-sm text-sky-800 dark:text-slate-400 leading-relaxed px-2 mb-8 font-medium">
            {isConnected
              ? `Anda sedang berbagi lokasi dengan ${partner.nama}.`
              : "Bagikan kode unik Anda atau masukkan kode pasangan untuk mulai berbagi lokasi."}
          </p>

          <button className="w-full bg-blue-600 text-sky-50 font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-blue-300 dark:shadow-none hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2">
            {!isConnected && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            )}
            {isConnected ? "Lihat Profil Pasangan" : "Hubungkan Sekarang"}
          </button>
        </div>
      </div>

      {/* Grid Tombol Peta & Riwayat */}
      <div className="grid grid-cols-2 gap-4 mt-2">
        <Link
          to="/map"
          className="bg-sky-50 dark:bg-slate-900 p-5 rounded-3xl shadow-[0_4px_15px_-5px_rgba(14,165,233,0.15)] dark:shadow-none border border-sky-100 dark:border-slate-800 flex flex-col items-center justify-center gap-3 hover:bg-sky-100 dark:hover:bg-slate-800 transition-colors group duration-300"
        >
          <div className="w-12 h-12 rounded-full bg-sky-200 dark:bg-slate-800 text-blue-700 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <span className="text-sm font-bold text-blue-950 dark:text-sky-50">
            Buka Peta
          </span>
        </Link>

        <Link
          to="/history"
          className="bg-sky-50 dark:bg-slate-900 p-5 rounded-3xl shadow-[0_4px_15px_-5px_rgba(14,165,233,0.15)] dark:shadow-none border border-sky-100 dark:border-slate-800 flex flex-col items-center justify-center gap-3 hover:bg-sky-100 dark:hover:bg-slate-800 transition-colors group duration-300"
        >
          <div className="w-12 h-12 rounded-full bg-sky-200 dark:bg-slate-800 text-blue-700 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
              <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
            </svg>
          </div>
          <span className="text-sm font-bold text-blue-950 dark:text-sky-50">
            Riwayat
          </span>
        </Link>
      </div>
    </div>
  );
}
