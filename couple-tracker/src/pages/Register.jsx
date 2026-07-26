import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await signUp(email, password);
      if (error) throw error;
      toast.success("Pendaftaran berhasil! Silakan login.");
    } catch (error) {
      toast.error(error.message || "Pendaftaran gagal.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Buat Akun
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Mulai berbagi lokasi dengan pasangan
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password (min. 6 karakter)"
          icon={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        <Button type="submit" isLoading={isLoading}>
          Daftar Sekarang
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Sudah punya akun?{" "}
        <Link
          to="/login"
          className="text-primary-600 font-medium hover:underline"
        >
          Masuk
        </Link>
      </p>
    </div>
  );
}
