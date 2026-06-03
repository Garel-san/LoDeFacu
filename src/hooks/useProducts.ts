import { useState, useEffect } from "react";
import { supabase } from "../lib/Supabase";

export interface Category {
  id: string;
  label: string;
  position: number;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  label: string;
  price: number;
  available: boolean;
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
  pickup_only: boolean;
  max_qty: number | null;
  variants: ProductVariant[];
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
    const [
      { data: cats, error: catsError },
      { data: prods, error: prodsError },
      { data: variants, error: variantsError },
    ] = await Promise.all([
      supabase.from("categories").select("*").order("position"),
      supabase.from("products").select("*").order("position"),
      supabase.from("product_variants").select("*").order("position"),
    ]);

    if (catsError || prodsError || variantsError) {
      setError("No se pudieron cargar los productos.");
    } else {
      setCategories(cats ?? []);
      const variantsByProduct = (variants ?? []).reduce<
        Record<number, ProductVariant[]>
      >((acc, v) => {
        if (!acc[v.product_id]) acc[v.product_id] = [];
        acc[v.product_id].push(v);
        return acc;
      }, {});
      const productsWithVariants = (prods ?? []).map((p) => ({
        ...p,
        variants: variantsByProduct[p.id] ?? [],
      }));
      setProducts(productsWithVariants);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchAll();

    const channel = supabase
      .channel("menu-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        fetchAll,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "categories" },
        fetchAll,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "product_variants" },
        fetchAll,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { products, categories, loading, error };
}
