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
      // Hentikan sharing
      if (watchIdRef.current)
        navigator.geolocation.clearWatch(watchIdRef.current);
      setIsSharing(false);

      // Update status is_online ke false di database
      supabase
        .from("locations")
        .update({ is_online: false })
        .eq("user_id", user.id)
        .then();
      toast.info("Berbagi lokasi dihentikan");
    } else {
      // Mulai sharing
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

  // 3. Dengarkan Lokasi Pasangan secara Realtime
  useEffect(() => {
    if (!partner) return;

    // Ambil lokasi terakhir pasangan terlebih dahulu
    supabase
      .from("locations")
      .select("*")
      .eq("user_id", partner.id)
      .single()
      .then(({ data }) => {
        if (data) setPartnerLocation(data);
      });

    // Subscribe ke perubahan realtime
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

  // Bersihkan interval saat komponen dibongkar
  useEffect(() => {
    return () => {
      if (watchIdRef.current)
        navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  return {
    myLocation,
    partnerLocation,
    isSharing,
    toggleSharing,
  };
}
