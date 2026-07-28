import { useState } from "react";
import {
  Copy,
  Check,
  LogOut,
  UserMinus,
  Key,
  HeartHandshake,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { usePartner } from "../hooks/usePartner";

export default function Profile() {
  const { profile, signOut } = useAuth();
  const { partner, isLoadingPartner, connectPartner, disconnectPartner } =
    usePartner();

  const [partnerCodeInput, setPartnerCodeInput] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(profile?.partner_code);
    setIsCopied(true);
    toast.success("Kode disalin ke clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleConnect = async (e) => {
    e.preventDefault();
    setIsConnecting(true);
    const success = await connectPartner(partnerCodeInput);
    if (success) {
      setPartnerCodeInput("");
      toast.success("Berhasil terhubung dengan pasangan!");
    }
    setIsConnecting(false);
  };

  const handleDisconnect = () => {
    if (
      window.confirm(
        "Yakin ingin memutus hubungan berbagi lokasi dengan pasangan? Data histori akan tetap tersimpan tetapi berbagi realtime akan berhenti.",
      )
    ) {
      disconnectPartner();
      toast.success("Hubungan dengan pasangan telah diputus.");
    }
  };

  if (!profile)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-blue-800 dark:text-blue-400 font-bold animate-pulse">
        Memuat profil...
      </div>
    );

  return (
    <div className="flex flex-col gap-5 pt-2 animate-in fade-in duration-500 pb-8">
      {/* Teks ditambahkan dark:text-sky-50 agar menjadi putih di mode gelap */}
      <h1 className="text-2xl font-extrabold text-blue-950 dark:text-sky-50 px-1">
        Profil Saya
      </h1>

      {/* Kartu Profil -> dark:bg-slate-900 */}
      <div className="bg-sky-50 dark:bg-slate-900 p-6 rounded-3xl shadow-[0_8px_30px_rgba(14,165,233,0.15)] dark:shadow-none border border-sky-100 dark:border-slate-800 text-center transition-colors">
        <div className="w-16 h-16 bg-sky-200 dark:bg-slate-800 text-blue-800 dark:text-sky-400 rounded-2xl mx-auto flex items-center justify-center font-extrabold text-3xl mb-4 border border-sky-300 dark:border-slate-700 shadow-inner">
          {profile.nama?.charAt(0).toUpperCase() || "U"}
        </div>

        <h2 className="font-bold text-blue-950 dark:text-white text-xl">
          {profile.nama}
        </h2>
        <p className="text-sm text-sky-700 dark:text-slate-400 font-semibold mb-6">
          {profile.email}
        </p>

        <div className="bg-sky-100/60 dark:bg-slate-800/50 border border-sky-200 dark:border-slate-700 rounded-2xl p-4 transition-colors">
          <p className="text-[10px] font-bold text-sky-700 dark:text-slate-400 uppercase tracking-widest mb-2">
            Kode Partner Anda
          </p>
          <div className="bg-sky-100 dark:bg-slate-800 rounded-xl p-3 flex justify-between items-center border border-sky-200 dark:border-slate-700 shadow-sm">
            <span className="font-mono font-bold text-lg text-blue-950 dark:text-sky-100 tracking-widest pl-2">
              {profile.partner_code || "------"}
            </span>
            <button
              onClick={copyCode}
              className="p-2 hover:bg-sky-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-blue-700 dark:text-sky-400"
              title="Salin Kode"
            >
              {isCopied ? (
                <Check
                  size={20}
                  className="text-emerald-600 dark:text-emerald-400"
                />
              ) : (
                <Copy size={20} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Bagian Pasangan -> dark:bg-slate-900 */}
      <div className="bg-sky-50 dark:bg-slate-900 p-6 rounded-3xl shadow-[0_8px_30px_rgba(14,165,233,0.15)] dark:shadow-none border border-sky-100 dark:border-slate-800 transition-colors">
        <h3 className="font-bold text-blue-950 dark:text-white mb-4 flex items-center gap-2">
          <HeartHandshake className="text-red-500" size={20} /> Pasangan
        </h3>

        {isLoadingPartner ? (
          <p className="text-center text-sky-700 dark:text-slate-400 py-4 animate-pulse font-bold">
            Mengecek data...
          </p>
        ) : partner ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-sky-100/60 dark:bg-slate-800/50 border border-sky-200 dark:border-slate-700 p-4 rounded-2xl">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center text-xl font-bold border border-red-200 dark:border-red-500/20 shadow-inner">
                {partner.nama?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-blue-950 dark:text-white">
                  {partner.nama}
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold tracking-wide">
                  Terhubung secara aktif
                </p>
              </div>
            </div>

            <button
              onClick={handleDisconnect}
              className="w-full bg-sky-100 dark:bg-slate-800 text-red-600 dark:text-red-400 font-bold py-3.5 px-6 rounded-2xl border-2 border-red-200 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-slate-700 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
            >
              <UserMinus size={18} /> Putuskan Hubungan
            </button>
          </div>
        ) : (
          <form onSubmit={handleConnect} className="space-y-4">
            <p className="text-sm text-sky-800 dark:text-slate-400 mb-5 font-semibold leading-relaxed">
              Masukkan 6 digit kode pasangan Anda untuk mulai berbagi lokasi.
            </p>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Key size={18} className="text-sky-500 dark:text-slate-500" />
              </div>
              {/* Kolom Input disesuaikan untuk Dark Mode */}
              <input
                type="text"
                placeholder="Misal: 4a2d4f"
                value={partnerCodeInput}
                onChange={(e) => setPartnerCodeInput(e.target.value)}
                maxLength={6}
                className="w-full bg-sky-100 dark:bg-slate-950 border-2 border-sky-300 dark:border-slate-700 text-blue-950 dark:text-white placeholder:text-sky-600 dark:placeholder:text-slate-500 rounded-2xl pl-11 pr-4 py-3.5 font-mono font-bold tracking-widest focus:bg-sky-50 dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-600/20 dark:focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 outline-none transition-all shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={partnerCodeInput.length < 6 || isConnecting}
              className="w-full bg-blue-600 dark:bg-blue-600 text-sky-50 font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-blue-300 dark:shadow-none hover:bg-blue-700 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:hover:translate-y-0 flex justify-center items-center gap-2"
            >
              {isConnecting ? "Memproses..." : "Hubungkan"}
            </button>
          </form>
        )}
      </div>

      {/* Logout */}
      <button
        onClick={signOut}
        className="w-full bg-slate-800 dark:bg-slate-800/80 dark:border dark:border-slate-700 text-sky-50 font-bold py-4 px-6 rounded-2xl shadow-lg dark:shadow-none hover:bg-slate-700 transition-all active:scale-95 flex items-center justify-center gap-2 mt-2"
      >
        <LogOut size={18} className="text-sky-100/70" />
        Keluar dari Akun
      </button>
    </div>
  );
}
