import { Navigate, Outlet, NavLink } from "react-router-dom";
import {
  Home,
  Map as MapIcon,
  User,
  Clock,
  Settings as SettingsIcon,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { cn } from "../utils/cn";

export default function AppLayout() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  const navItems = [
    { to: "/dashboard", icon: Home, label: "Home" },
    { to: "/map", icon: MapIcon, label: "Map" },
    { to: "/history", icon: Clock, label: "Riwayat" },
    { to: "/profile", icon: User, label: "Profile" },
    { to: "/settings", icon: SettingsIcon, label: "Setelan" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pb-20">
      {/* Konten Utama */}
      <main className="container mx-auto max-w-md p-4 animate-in fade-in duration-300">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full max-w-md left-1/2 -translate-x-1/2 bg-white/80 dark:bg-dark-card/80 backdrop-blur-lg border-t border-gray-200 dark:border-dark-border pb-safe">
        <div className="flex justify-around items-center p-3">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
                  isActive
                    ? "text-primary-600 dark:text-primary-500"
                    : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300",
                )
              }
            >
              <Icon size={24} />
              <span className="text-[10px] font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
