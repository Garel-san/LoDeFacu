import { useState, useEffect } from "react";
import { supabase } from "../lib/Supabase";

export interface DeliveryZone {
  id: number;
  label: string;
  price: number;
  position: number;
}

interface UseDeliveryZonesResult {
  zones: DeliveryZone[];
  loading: boolean;
}

export function useDeliveryZones(): UseDeliveryZonesResult {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchZones() {
    const { data } = await supabase
      .from("delivery_zones")
      .select("*")
      .order("position");
    setZones(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    fetchZones();

    const channel = supabase
      .channel("zones-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "delivery_zones" }, fetchZones)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { zones, loading };
}
