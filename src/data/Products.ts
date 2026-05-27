import imgMilaCompleta from "../assets/MilaCompleta.png";
import imgMilaSimple from "../assets/MilaSimple.png";
import imgHamburguesaCompleta from "../assets/HamburguesaCompleta.png";
import imgHamburguesaSimple from "../assets/HamburguesaSimple.png";
import imgConoFritas from "../assets/ConoFritas.png";

export type Badge = "popular" | "nuevo" | null;
export type DeliveryType = "delivery" | "pickup";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  badge: Badge;
}

export interface Category {
  id: string;
  label: string;
}

export interface DeliveryZone {
  id: string;
  label: string;
  price: number;
}

export interface Promo {
  label: string;
  title: string;
  originalPrice: number;
  price: number;
}

export interface Store {
  name: string;
  whatsapp: string;
  address: string;
  deliveryOpenTime: string;
  deliveryCloseTime: string;
  deliveryAvailable: boolean;
}

export const CATEGORIES: Category[] = [
  { id: "todo", label: "Todo" },
  { id: "sanguches", label: "Sanguches" },
  { id: "hamburguesas", label: "Hamburguesas" },
  { id: "acompañamientos", label: "Acompañamientos" },
];

export const DELIVERY_ZONES: DeliveryZone[] = [
  { id: "centro", label: "Centro", price: 800 },
  { id: "norte", label: "Norte", price: 1200 },
  { id: "sur", label: "Sur", price: 1000 },
];

export const PROMO: Promo = {
  label: "Promo del día",
  title: "Hamburguesa Completa + Cono de Papas",
  originalPrice: 8500,
  price: 7500,
};

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Sanguche de Milanesa Completo",
    description: "Milanesa, lechuga, tomate, huevo y mayonesa",
    price: 9500,
    category: "sanguches",
    image: imgMilaCompleta,
    available: true,
    badge: "popular",
  },
  {
    id: 2,
    name: "Sanguche de Milanesa Simple",
    description: "Milanesa en pan, a tu gusto",
    price: 8500,
    category: "sanguches",
    image: imgMilaSimple,
    available: true,
    badge: null,
  },
  {
    id: 3,
    name: "Hamburguesa Completa",
    description: "Carne, lechuga, tomate, cheddar y mayonesa",
    price: 6500,
    category: "hamburguesas",
    image: imgHamburguesaCompleta,
    available: true,
    badge: "popular",
  },
  {
    id: 4,
    name: "Hamburguesa Simple",
    description: "Carne y pan, clásica",
    price: 5500,
    category: "hamburguesas",
    image: imgHamburguesaSimple,
    available: true,
    badge: null,
  },
  {
    id: 5,
    name: "Cono de Papas",
    description: "Papas fritas crocantes, sal y condimentos",
    price: 2000,
    category: "acompañamientos",
    image: imgConoFritas,
    available: true,
    badge: null,
  },
];

export const STORE: Store = {
  name: "Kiosco LoDeFacu",
  whatsapp: "541122545788",
  address: "Recondo 298",
  deliveryOpenTime: "20:00",
  deliveryCloseTime: "00:00",
  deliveryAvailable: true,
};
