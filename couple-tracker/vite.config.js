import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  // PENTING: Jika repo GitHub Anda bernama "couple-tracker", ubah base menjadi '/couple-tracker/'
  // Jika menggunakan custom domain, biarkan '/'
  base: "/Web-App/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // Otomatis update di background jika ada versi baru
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "Couple Tracker App",
        short_name: "Tracker",
        description: "Aplikasi berbagi lokasi pasangan secara real-time",
        theme_color: "#3b82f6", // Warna header di browser mobile (Biru Tailwind)
        background_color: "#ffffff",
        display: "standalone", // Membuatnya tampil seperti aplikasi native tanpa UI browser
        orientation: "portrait",
        icons: [
          {
            src: "icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable", // Mendukung ikon melingkar/kotak dinamis di Android
          },
        ],
      },
      workbox: {
        // Mengamankan routing React agar tidak error 404 saat direfresh di PWA
        navigateFallback: "/index.html",
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
    }),
  ],
});
