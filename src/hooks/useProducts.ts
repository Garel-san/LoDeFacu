import { useState, useEffect } from "react";
import { supabase } from "../lib/Supabase";

export interface Category {
  id: string;
  label: string;
  position: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: string;
  image_url: string;
  available: boolean;
  badge: "popular" | "nuevo" | null;
  position: number;
}

interface UseProductsResult {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchAll() {
    const [{ data: cats, error: catsError }, { data: prods, error: prodsError }] =
      await Promise.all([
        supabase.from("categories").select("*").order("position"),
        supabase.from("products").select("*").order("position"),
      ]);

    if (catsError || prodsError) {
      setError("No se pudieron cargar los productos.");
    } else {
      setCategories(cats ?? []);
      setProducts(prods ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchAll();

    // Escuchar cambios en tiempo real
    const channel = supabase
      .channel("menu-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, fetchAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "categories" }, fetchAll)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { products, categories, loading, error };
}
