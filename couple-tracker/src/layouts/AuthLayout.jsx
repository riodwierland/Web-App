import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AuthLayout() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-dark-bg dark:to-slate-800 p-4">
      {/* Ornamen dekorasi background */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>

      {/* Card Form */}
      <div className="relative w-full max-w-md bg-white/70 dark:bg-dark-card/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700 p-8 z-10">
        <Outlet />
      </div>
    </div>
  );
}
