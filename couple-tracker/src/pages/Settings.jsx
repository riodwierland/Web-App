import { useState, useEffect } from "react";
import { Moon, Sun, Monitor } from "lucide-react";

export default function Settings() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");

  useEffect(() => {
    const root = window.document.documentElement;

    // Hapus class 'dark' terlebih dahulu untuk mereset keadaan
    root.classList.remove("dark");

    // Logika presisi untuk Tailwind CSS
    if (theme === "system") {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      if (systemPrefersDark) {
        root.classList.add("dark");
      }
    } else if (theme === "dark") {
      root.classList.add("dark");
    }
    // Jika theme === "light", kita tidak perlu menambahkan apa-apa karena itu adalah default

    localStorage.setItem("theme", theme);
  }, [theme]);

  const themes = [
    { id: "light", label: "Terang", icon: Sun },
    { id: "dark", label: "Gelap", icon: Moon },
    { id: "system", label: "Otomatis", icon: Monitor },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pt-2">
      {/* Header Pengaturan */}
      <div className="bg-sky-50 dark:bg-slate-900 p-6 rounded-3xl shadow-[0_8px_30px_rgba(14,165,233,0.15)] dark:shadow-none border border-sky-100 dark:border-slate-800 flex flex-col gap-1 transition-colors duration-300">
        <h1 className="text-2xl font-extrabold text-blue-950 dark:text-sky-50">
          Pengaturan
        </h1>
        <p className="text-sm text-sky-700 dark:text-slate-400 font-medium">
          Sesuaikan preferensi aplikasi Anda
        </p>
      </div>

      {/* Kontainer Pilihan Tema */}
      <div className="bg-sky-50 dark:bg-slate-900 p-6 rounded-3xl shadow-[0_8px_30px_rgba(14,165,233,0.15)] dark:shadow-none border border-sky-100 dark:border-slate-800 relative overflow-hidden transition-colors duration-300">
        {/* Dekorasi kecil (di mode gelap akan disembunyikan/digelapkan) */}
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-sky-200/50 dark:bg-slate-800/50 rounded-full blur-xl pointer-events-none"></div>

        <div className="relative z-10">
          <h2 className="text-sm font-bold text-sky-700 dark:text-slate-500 uppercase tracking-wider mb-5">
            Tampilan Aplikasi
          </h2>

          <div className="grid grid-cols-3 gap-3">
            {themes.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTheme(id)}
                className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 active:scale-95 ${
                  theme === id
                    ? "border-blue-600 dark:border-blue-500 bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 shadow-sm"
                    : "border-sky-200 dark:border-slate-700 text-sky-700 dark:text-slate-400 hover:bg-sky-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon
                  size={24}
                  className={
                    theme === id ? "fill-blue-200 dark:fill-blue-900/50" : ""
                  }
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
