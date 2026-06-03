import {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  type ReactNode,
} from "react";

export type DeliveryType = "delivery" | "pickup";

export interface CartProduct {
  id: number;
  cartKey: string;
  name: string;
  price: number;
  image: string;
  variantLabel?: string;
  [key: string]: unknown;
}

export interface CartItem extends CartProduct {
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (product: CartProduct) => void;
  removeItem: (cartKey: string) => void;
  deleteItem: (cartKey: string) => void;
  clearCart: () => void;
  subtotal: number;
  totalCount: number;
  hasPickupOnlyItems: boolean; // ← nuevo
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

const STORAGE_KEY = "lodefacu_cart_v2";

interface CartState {
  items: CartItem[];
  deliveryType: DeliveryType;
  zone: number | null;
  address: string;
  note: string;
}

function loadInitialState(): CartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as CartState;
  } catch {
    // JSON corrupto — arrancar limpio
  }
  return {
    items: [],
    deliveryType: "delivery",
    zone: null,
    address: "",
    note: "",
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const initial = loadInitialState();

  const [items, setItems] = useState<CartItem[]>(initial.items);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>(
    initial.deliveryType,
  );
  const [zone, setZone] = useState<number | null>(initial.zone);
  const [address, setAddress] = useState<string>(initial.address);
  const [note, setNote] = useState<string>(initial.note);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ items, deliveryType, zone, address, note }),
      );
    } catch {
      // localStorage lleno o bloqueado
    }
  }, [items, deliveryType, zone, address, note]);

  const addItem = (product: CartProduct) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.cartKey === product.cartKey);
      if (existing) {
        return prev.map((i) =>
          i.cartKey === product.cartKey ? { ...i, qty: i.qty + 1 } : i,
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeItem = (cartKey: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.cartKey === cartKey);
      if (!existing) return prev;
      if (existing.qty === 1) return prev.filter((i) => i.cartKey !== cartKey);
      return prev.map((i) =>
        i.cartKey === cartKey ? { ...i, qty: i.qty - 1 } : i,
      );
    });
  };

  const deleteItem = (cartKey: string) => {
    setItems((prev) => prev.filter((i) => i.cartKey !== cartKey));
  };

  const clearCart = () => {
    setItems([]);
    setAddress("");
    setNote("");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignorar
    }
  };

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items],
  );

  const totalCount = useMemo(
    () => items.reduce((sum, i) => sum + i.qty, 0),
    [items],
  );

  // ← nuevo
  const hasPickupOnlyItems = useMemo(
    () => items.some((i) => i.pickup_only === true),
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
        hasPickupOnlyItems, // ← nuevo
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
