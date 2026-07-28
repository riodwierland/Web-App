import { useState, useEffect } from "react";
import { Moon, Sun, Monitor } from "lucide-react";

export default function Settings() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const themes = [
    { id: "light", label: "Terang", icon: Sun },
    { id: "dark", label: "Gelap", icon: Moon },
    { id: "system", label: "Otomatis", icon: Monitor },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pt-2">
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-zinc-100 flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold text-zinc-900">Pengaturan</h1>
        <p className="text-sm text-zinc-500 font-medium">
          Sesuaikan preferensi aplikasi Anda
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm relative overflow-hidden">
        {/* Dekorasi kecil */}
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-zinc-50 rounded-full blur-xl"></div>

        <div className="relative z-10">
          <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-5">
            Tampilan Aplikasi
          </h2>

          <div className="grid grid-cols-3 gap-3">
            {themes.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTheme(id)}
                className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 active:scale-95 ${
                  theme === id
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                    : "border-zinc-100 text-zinc-500 hover:bg-zinc-50 hover:border-zinc-200"
                }`}
              >
                <Icon
                  size={24}
                  className={theme === id ? "fill-indigo-100" : ""}
                />
                <span className="text-xs font-bold tracking-wide">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
