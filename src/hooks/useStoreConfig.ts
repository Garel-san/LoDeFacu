import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/Supabase";

export interface StoreConfig {
  name: string;
  whatsapp: string;
  address: string;
  delivery_open_time: string;
  delivery_close_time: string;
  delivery_available: boolean;
  delivery_min_order: number; // ← nuevo
  promo_active: boolean;
  promo_label: string;
  promo_title: string;
  promo_price: number;
  promo_original_price: number;
}

interface UseStoreConfigResult {
  config: StoreConfig | null;
  loading: boolean;
  error: string | null;
}

export function useStoreConfig(): UseStoreConfigResult {
  const [config, setConfig] = useState<StoreConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelName = useRef(
    `config-realtime-${Math.random().toString(36).slice(2)}`,
  );

  async function fetchConfig() {
    const { data, error: fetchError } = await supabase
      .from("store_config")
      .select("*")
      .eq("id", 1)
      .single();

    if (fetchError) {
      setError("No se pudo cargar la configuración del local.");
    } else {
      setConfig(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchConfig();

    const channel = supabase
      .channel(channelName.current)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "store_config" },
        fetchConfig,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { config, loading, error };
}
