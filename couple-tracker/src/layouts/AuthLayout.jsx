import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AuthLayout() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    /* Latar Belakang Login Biru Langit */
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-sky-200 via-sky-100 to-sky-200 p-4 relative overflow-hidden">
      {/* Ornamen dekorasi */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-sky-400/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-300/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Card Form: Kontainer diubah ke sky-50 (bukan white) */}
      <div className="relative w-full max-w-md bg-sky-50/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_30px_-10px_rgba(14,165,233,0.3)] border border-sky-200 p-8 z-10">
        <Outlet />
      </div>
    </div>
  );
}
