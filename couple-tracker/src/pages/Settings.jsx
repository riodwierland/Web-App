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
    { id: "system", label: "Sistem", icon: Monitor },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Pengaturan
      </h1>

      <div className="bg-white dark:bg-dark-card p-6 rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Tampilan Aplikasi
        </h2>

        <div className="grid grid-cols-3 gap-3">
          {themes.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTheme(id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                theme === id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "border-gray-200 dark:border-dark-border text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <Icon size={24} />
              <span className="text-xs font-semibold">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
