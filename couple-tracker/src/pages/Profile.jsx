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
  const [isCopied, setIsCopied] = useState(false); // Tambahan state untuk efek visual Copy

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
      <div className="flex flex-col items-center justify-center h-[60vh] text-blue-800 font-bold animate-pulse">
        Memuat profil...
      </div>
    );

  return (
    <div className="flex flex-col gap-5 pt-2 animate-in fade-in duration-500 pb-8">
      <h1 className="text-2xl font-extrabold text-blue-950 px-1">
        Profil Saya
      </h1>

      {/* Kartu Profil Sendiri */}
      <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-blue-50 text-center">
        <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-2xl mx-auto flex items-center justify-center font-extrabold text-3xl shadow-inner mb-4">
          {profile.nama?.charAt(0).toUpperCase() || "U"}
        </div>

        <h2 className="font-bold text-blue-950 text-xl">{profile.nama}</h2>
        <p className="text-sm text-blue-800/70 font-medium mb-6">
          {profile.email}
        </p>

        <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4">
          <p className="text-[10px] font-bold text-blue-800/70 uppercase tracking-widest mb-2">
            Kode Partner Anda
          </p>
          <div className="bg-white rounded-xl p-3 flex justify-between items-center border border-blue-50 shadow-sm">
            <span className="font-mono font-bold text-lg text-blue-950 tracking-widest pl-2">
              {profile.partner_code || "------"}
            </span>
            <button
              onClick={copyCode}
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
              title="Salin Kode"
            >
              {isCopied ? (
                <Check size={20} className="text-emerald-500" />
              ) : (
                <Copy size={20} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Bagian Pasangan */}
      <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-blue-50">
        <h3 className="font-bold text-blue-950 mb-4 flex items-center gap-2">
          <HeartHandshake className="text-red-500" size={20} /> Pasangan
        </h3>

        {isLoadingPartner ? (
          <p className="text-center text-blue-800/70 py-4 animate-pulse font-medium">
            Mengecek data...
          </p>
        ) : partner ? (
          // Jika SUDAH Terhubung
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-blue-50/50 border border-blue-100 p-4 rounded-2xl">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-xl font-bold shadow-inner">
                {partner.nama?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-blue-950">{partner.nama}</p>
                <p className="text-xs text-emerald-500 font-bold tracking-wide">
                  Terhubung secara aktif
                </p>
              </div>
            </div>

            <button
              onClick={handleDisconnect}
              className="w-full bg-red-50 text-red-600 font-bold py-3.5 px-6 rounded-2xl border border-red-100 hover:bg-red-100 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
            >
              <UserMinus size={18} /> Putuskan Hubungan
            </button>
          </div>
        ) : (
          // Jika BELUM Terhubung
          <form onSubmit={handleConnect} className="space-y-4">
            <p className="text-sm text-blue-800/80 mb-5 font-medium leading-relaxed">
              Masukkan 6 digit kode pasangan Anda untuk mulai berbagi lokasi.
            </p>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Key size={18} className="text-blue-300" />
              </div>
              <input
                type="text"
                placeholder="MISAL: AB12CD"
                value={partnerCodeInput}
                onChange={(e) => setPartnerCodeInput(e.target.value)}
                maxLength={6}
                className="w-full bg-white border-2 border-blue-50 text-blue-950 placeholder:text-blue-300 rounded-2xl pl-11 pr-4 py-3.5 font-mono font-bold tracking-widest focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={partnerCodeInput.length < 6 || isConnecting}
              className="w-full bg-blue-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:hover:translate-y-0 flex justify-center items-center gap-2"
            >
              {isConnecting ? "Memproses..." : "Hubungkan"}
            </button>
          </form>
        )}
      </div>

      {/* Logout */}
      <button
        onClick={signOut}
        className="w-full bg-slate-800 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:bg-slate-700 transition-all active:scale-95 flex items-center justify-center gap-2 mt-2"
      >
        <LogOut size={18} className="text-white/70" />
        Keluar dari Akun
      </button>
    </div>
  );
}
