import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../services/supabase";
import { useAuth } from "../contexts/AuthContext";
import { usePartner } from "./usePartner";
import { toast } from "sonner";

export function useLocations() {
  const { user } = useAuth();
  const { partner } = usePartner();

  const [myLocation, setMyLocation] = useState(null);
  const [partnerLocation, setPartnerLocation] = useState(null);
  const [isSharing, setIsSharing] = useState(false);

  const watchIdRef = useRef(null);

  // 1. Fungsi Update Lokasi Sendiri ke Database
  const updateMyLocation = useCallback(
    async (position) => {
      const { latitude, longitude, accuracy, speed, heading } = position.coords;

      const locationData = {
        user_id: user.id,
        latitude,
        longitude,
        accuracy,
        speed,
        heading,
        is_online: true,
        updated_at: new Date().toISOString(),
      };

      setMyLocation(locationData);

      const { error } = await supabase
        .from("locations")
        .upsert(locationData, { onConflict: "user_id" });

      if (error) console.error("Gagal update lokasi ke server:", error);
    },
    [user],
  );

  // 2. Mulai/Berhenti Berbagi Lokasi
  const toggleSharing = () => {
    if (isSharing) {
      if (watchIdRef.current)
        navigator.geolocation.clearWatch(watchIdRef.current);
      setIsSharing(false);

      supabase
        .from("locations")
        .update({ is_online: false, updated_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .then();
      toast.info("Berbagi lokasi dihentikan");
    } else {
      if (!navigator.geolocation) {
        return toast.error("Browser Anda tidak mendukung GPS");
      }

      toast.loading("Mencari lokasi...", { id: "gps" });
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          toast.success("GPS Terkunci!", { id: "gps" });
          setIsSharing(true);
          updateMyLocation(position);
        },
        (error) => {
          toast.error("Gagal mendapatkan lokasi. Pastikan izin GPS aktif.", {
            id: "gps",
          });
          setIsSharing(false);
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 },
      );
    }
  };

  // 3. FITUR BARU: Heartbeat (Detak Jantung)
  // Memastikan kita tetap "Live" di database walau sedang diam (tidak berpindah posisi)
  useEffect(() => {
    let heartbeatInterval;
    if (isSharing && user) {
      heartbeatInterval = setInterval(() => {
        supabase
          .from("locations")
          .update({ updated_at: new Date().toISOString(), is_online: true })
          .eq("user_id", user.id)
          .then();
      }, 20000); // Kirim sinyal setiap 20 detik
    }
    return () => {
      if (heartbeatInterval) clearInterval(heartbeatInterval);
    };
  }, [isSharing, user]);

  // 4. Dengarkan Lokasi Pasangan secara Realtime
  useEffect(() => {
    if (!partner) return;

    supabase
      .from("locations")
      .select("*")
      .eq("user_id", partner.id)
      .single()
      .then(({ data }) => {
        if (data) setPartnerLocation(data);
      });

    const channel = supabase
      .channel("partner-tracking")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "locations",
          filter: `user_id=eq.${partner.id}`,
        },
        (payload) => {
          setPartnerLocation(payload.new);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [partner]);

  // 5. FITUR BARU: Auto-Offline (Penangkal Aplikasi Ditutup Paksa)
  useEffect(() => {
    if (!partnerLocation || !partnerLocation.is_online) return;

    const checkInterval = setInterval(() => {
      const lastUpdate = new Date(partnerLocation.updated_at).getTime();
      const now = new Date().getTime();
      const diffInSeconds = (now - lastUpdate) / 1000;

      // Jika pasangan tidak mengirim sinyal heartbeat lebih dari 40 detik, matikan paksa di layar!
      if (diffInSeconds > 40) {
        setPartnerLocation((prev) =>
          prev ? { ...prev, is_online: false } : prev,
        );
      }
    }, 5000); // Cek setiap 5 detik

    return () => clearInterval(checkInterval);
  }, [partnerLocation]);

  // 6. Tangani Refresh Normal
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isSharing && user) {
        supabase
          .from("locations")
          .update({ is_online: false, updated_at: new Date().toISOString() })
          .eq("user_id", user.id)
          .then();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (watchIdRef.current)
        navigator.geolocation.clearWatch(watchIdRef.current);
      handleBeforeUnload();
    };
  }, [isSharing, user]);

  return {
    myLocation,
    partnerLocation,
    isSharing,
    toggleSharing,
  };
}
