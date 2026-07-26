import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, MapPin, Heart } from "lucide-react";
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
    <div className="animate-in fade-in zoom-in-95 duration-500">
      {/* Icon Logo Buatan */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40 rotate-3 hover:rotate-0 transition-transform">
          <MapPin size={32} className="text-white" />
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
          Selamat Datang
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          Masuk untuk mulai berbagi lokasi dengan pasanganmu
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <Input
          type="email"
          placeholder="Alamat Email"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Kata Sandi"
          icon={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" isLoading={isLoading} className="mt-2">
          Masuk Sekarang
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400 font-medium">
        Belum punya akun?{" "}
        <Link
          to="/register"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline transition-colors"
        >
          Daftar di sini
        </Link>
      </p>
    </div>
  );
}
