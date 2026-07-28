import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AuthLayout() {
  const { user } = useAuth();

  // Logika asli: Jika sudah login, langsung lempar ke Dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    /* Latar Belakang Global yang selaras dengan AppLayout */
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-slate-100 to-indigo-50 p-4 relative overflow-hidden">
      {/* Ornamen dekorasi background (Disesuaikan warnanya dengan tema biru/indigo) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-300/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Card Form (Diperbarui dengan shadow dan border yang lebih elegan) */}
      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_30px_-10px_rgba(37,99,235,0.15)] border border-blue-100/60 p-8 z-10">
        <Outlet />
      </div>
    </div>
  );
}
