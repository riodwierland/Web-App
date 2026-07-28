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
      <nav className="fixed bottom-0 left-0 right-0 p-4 md:p-6 flex justify-center z-50 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-lg px-6 py-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-zinc-100 flex items-center gap-6 sm:gap-8 pointer-events-auto">
          <Link
            to="/"
            className={`flex flex-col items-center gap-1.5 transition-all duration-200 ${isActive("/") ? "text-indigo-600 scale-110" : "text-zinc-400 hover:text-zinc-600"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill={isActive("/") ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className="text-[10px] font-semibold tracking-wide">
              Home
            </span>
          </Link>

          <Link
            to="/map"
            className={`flex flex-col items-center gap-1.5 transition-all duration-200 ${isActive("/map") ? "text-indigo-600 scale-110" : "text-zinc-400 hover:text-zinc-600"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill={isActive("/map") ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
              <line x1="9" x2="9" y1="3" y2="18" />
              <line x1="15" x2="15" y1="6" y2="21" />
            </svg>
            <span className="text-[10px] font-semibold tracking-wide">Map</span>
          </Link>

          <Link
            to="/history"
            className={`flex flex-col items-center gap-1.5 transition-all duration-200 ${isActive("/history") ? "text-indigo-600 scale-110" : "text-zinc-400 hover:text-zinc-600"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="text-[10px] font-semibold tracking-wide">
              Riwayat
            </span>
          </Link>

          <Link
            to="/profile"
            className={`flex flex-col items-center gap-1.5 transition-all duration-200 ${isActive("/profile") ? "text-indigo-600 scale-110" : "text-zinc-400 hover:text-zinc-600"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill={isActive("/profile") ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="text-[10px] font-semibold tracking-wide">
              Profile
            </span>
          </Link>

          <Link
            to="/settings"
            className={`flex flex-col items-center gap-1.5 transition-all duration-200 ${isActive("/settings") ? "text-indigo-600 scale-110" : "text-zinc-400 hover:text-zinc-600"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span className="text-[10px] font-semibold tracking-wide">
              Setelan
            </span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
