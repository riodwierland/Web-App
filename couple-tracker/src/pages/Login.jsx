import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      toast.success("Berhasil login!");
    } catch (error) {
      toast.error(error.message || "Gagal login. Periksa kredensial Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 bg-white p-8 rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-zinc-100 relative overflow-hidden max-w-sm w-full mx-auto mt-10">
      {/* Dekorasi Latar Belakang */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/80 rounded-full blur-2xl -mr-10 -mt-10"></div>

      <div className="relative z-10">
        {/* Icon Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 rotate-3 hover:rotate-0 transition-transform duration-300">
            <MapPin size={32} className="text-white" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-zinc-900 mb-2 tracking-tight">
            Selamat Datang
          </h1>
          <p className="text-sm text-zinc-500 font-medium leading-relaxed px-4">
            Masuk untuk mulai berbagi lokasi dengan pasanganmu
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            placeholder="Alamat Email"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-zinc-50 border-zinc-200 focus:border-indigo-500 focus:ring-indigo-500/20"
          />
          <Input
            type="password"
            placeholder="Kata Sandi"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-zinc-50 border-zinc-200 focus:border-indigo-500 focus:ring-indigo-500/20"
          />

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 py-3.5 rounded-xl font-semibold transition-all"
          >
            Masuk Sekarang
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-500 font-medium">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-colors"
          >
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
