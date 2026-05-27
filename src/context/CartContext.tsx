import { createContext, useContext, useState, useMemo, type ReactNode } from "react";

export type DeliveryType = "delivery" | "pickup";

// Tipo mínimo que el carrito necesita de un producto
export interface CartProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  [key: string]: unknown; // permite campos extra como image_url, category_id, etc.
}

export interface CartItem extends CartProduct {
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (product: CartProduct) => void;
  removeItem: (productId: number) => void;
  deleteItem: (productId: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalCount: number;
  deliveryType: DeliveryType;
  setDeliveryType: (type: DeliveryType) => void;
  zone: number | null;
  setZone: (zoneId: number | null) => void;
  address: string;
  setAddress: (address: string) => void;
  note: string;
  setNote: (note: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("delivery");
  const [zone, setZone] = useState<number | null>(null);
  const [address, setAddress] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const addItem = (product: CartProduct) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i,
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeItem = (productId: number) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === productId);
      if (!existing) return prev;
      if (existing.qty === 1) return prev.filter((i) => i.id !== productId);
      return prev.map((i) =>
        i.id === productId ? { ...i, qty: i.qty - 1 } : i,
      );
    });
  };

  const deleteItem = (productId: number) => {
    setItems((prev) => prev.filter((i) => i.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
    setAddress("");
    setNote("");
  };

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items],
  );

  const totalCount = useMemo(
    () => items.reduce((sum, i) => sum + i.qty, 0),
    [items],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        deleteItem,
        clearCart,
        subtotal,
        totalCount,
        deliveryType,
        setDeliveryType,
        zone,
        setZone,
        address,
        setAddress,
        note,
        setNote,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
