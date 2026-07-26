import { useState, useEffect, useCallback } from "react";
import { supabase } from "../services/supabase";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

export function usePartner() {
  const { user } = useAuth();
  const [partner, setPartner] = useState(null);
  const [isLoadingPartner, setIsLoadingPartner] = useState(true);

  const fetchPartner = useCallback(async () => {
    if (!user) return;
    setIsLoadingPartner(true);
    try {
      // 1. Cari relasi aktif di tabel couples
      const { data: relation, error: relationError } = await supabase
        .from("couples")
        .select("*")
        .or(`user1.eq.${user.id},user2.eq.${user.id}`)
        .eq("status", "connected")
        .maybeSingle();

      if (relationError && relationError.code !== "PGRST116")
        throw relationError;

      // 2. Jika ada, ambil profil pasangannya
      if (relation) {
        const partnerId =
          relation.user1 === user.id ? relation.user2 : relation.user1;
        const { data: partnerData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", partnerId)
          .single();

        if (profileError) throw profileError;
        setPartner(partnerData);
      } else {
        setPartner(null);
      }
    } catch (error) {
      console.error("Error fetching partner:", error);
    } finally {
      setIsLoadingPartner(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPartner();
  }, [fetchPartner]);

  const connectPartner = async (partnerCode) => {
    if (!partnerCode) return toast.error("Masukkan kode partner!");
    const { data, error } = await supabase.rpc("connect_partner", {
      p_code: partnerCode.trim(),
    });

    if (error) {
      toast.error("Gagal menghubungi server.");
      return false;
    }

    if (data.success) {
      toast.success(data.message);
      await fetchPartner(); // Refresh data
      return true;
    } else {
      toast.error(data.message);
      return false;
    }
  };

  const disconnectPartner = async () => {
    const { data, error } = await supabase.rpc("disconnect_partner");
    if (error) return toast.error("Gagal memutus hubungan.");

    if (data.success) {
      toast.success(data.message);
      setPartner(null);
    }
  };

  return {
    partner,
    isLoadingPartner,
    connectPartner,
    disconnectPartner,
    refetchPartner: fetchPartner,
  };
}
