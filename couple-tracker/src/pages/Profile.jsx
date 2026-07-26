import { useState } from "react";
import { Copy, LogOut, UserMinus, Key, HeartHandshake } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { usePartner } from "../hooks/usePartner";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function Profile() {
  const { profile, signOut } = useAuth();
  const { partner, isLoadingPartner, connectPartner, disconnectPartner } =
    usePartner();
  const [partnerCodeInput, setPartnerCodeInput] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(profile?.partner_code);
    toast.success("Kode disalin ke clipboard!");
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    const success = await connectPartner(partnerCodeInput);
    if (success) setPartnerCodeInput("");
    setIsConnecting(false);
  };

  const handleDisconnect = () => {
    if (
      window.confirm(
        "Yakin ingin memutus hubungan berbagi lokasi dengan pasangan? Data histori akan tetap tersimpan tetapi berbagi realtime akan berhenti.",
      )
    ) {
      disconnectPartner();
    }
  };

  if (!profile)
    return <div className="text-center mt-10">Memuat profil...</div>;

  return (
    <div className="space-y-6 pb-6 animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Profil Saya
      </h1>

      {/* Kartu Profil Sendiri */}
      <div className="bg-white dark:bg-dark-card p-6 rounded-3xl border border-gray-100 dark:border-dark-border text-center">
        <div className="w-24 h-24 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-4">
          {profile.nama?.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {profile.nama}
        </h2>
        <p className="text-gray-500 text-sm mb-6">{profile.email}</p>

        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl">
          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-2">
            Kode Partner Anda
          </p>
          <div className="flex items-center justify-between bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border px-4 py-3 rounded-xl">
            <span className="font-mono text-xl font-bold tracking-widest text-primary-600 dark:text-primary-500">
              {profile.partner_code}
            </span>
            <button
              onClick={copyCode}
              className="text-gray-400 hover:text-primary-600 transition-colors p-2 active:scale-90"
            >
              <Copy size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Bagian Pasangan */}
      <div className="bg-white dark:bg-dark-card p-6 rounded-3xl border border-gray-100 dark:border-dark-border">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <HeartHandshake className="text-red-500" /> Pasangan
        </h3>

        {isLoadingPartner ? (
          <p className="text-center text-gray-500 py-4 animate-pulse">
            Mengecek data...
          </p>
        ) : partner ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xl font-bold">
                {partner.nama?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">
                  {partner.nama}
                </p>
                <p className="text-xs text-green-500 font-medium">
                  Terhubung secara aktif
                </p>
              </div>
            </div>
            <Button
              variant="danger"
              onClick={handleDisconnect}
              className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 shadow-none"
            >
              <UserMinus size={18} /> Putuskan Hubungan
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Masukkan 6 digit kode pasangan Anda untuk mulai berbagi lokasi.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Misal: AB12CD"
                icon={Key}
                className="font-mono uppercase tracking-widest"
                value={partnerCodeInput}
                onChange={(e) =>
                  setPartnerCodeInput(e.target.value.toUpperCase())
                }
                maxLength={6}
              />
            </div>
            <Button
              onClick={handleConnect}
              isLoading={isConnecting}
              disabled={partnerCodeInput.length < 6}
            >
              Hubungkan
            </Button>
          </div>
        )}
      </div>

      {/* Logout */}
      <Button
        variant="secondary"
        onClick={signOut}
        className="text-red-500 border-red-100 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/10"
      >
        <LogOut size={20} /> Keluar dari Akun
      </Button>
    </div>
  );
}
