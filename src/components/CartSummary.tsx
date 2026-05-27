import { useCart } from "../context/CartContext";
import { useStoreStatus } from "../hooks/useStoreStatus";
import { useDeliveryZones } from "../hooks/useDeliveryZones";
import type { DeliveryType } from "../context/CartContext";
import type { StoreConfig } from "../hooks/useStoreConfig";

interface CartSummaryProps {
  config: StoreConfig | null;
}

export function CartSummary({ config }: CartSummaryProps) {
  const {
    items,
    subtotal,
    deliveryType,
    setDeliveryType,
    zone,
    setZone,
    address,
    setAddress,
    clearCart,
    note,
    setNote,
  } = useCart();

  const { zones } = useDeliveryZones();
  const { isOpen } = useStoreStatus(
    config?.delivery_open_time ?? "20:00",
    config?.delivery_close_time ?? "00:00"
  );

  const selectedZone = zones.find((z) => z.id === zone);
  const deliveryCost = deliveryType === "delivery" ? (selectedZone?.price ?? 0) : 0;
  const total = subtotal + deliveryCost;

  const buildWhatsAppMessage = () => {
    const lines = items.map(
      (i) => `• ${i.name} x${i.qty} — $${(i.price * i.qty).toLocaleString("es-AR")}`
    );
    const delivery =
      deliveryType === "delivery"
        ? `📦 Delivery · ${selectedZone?.label ?? "zona no seleccionada"}${address.trim() ? ` — ${address.trim()}` : ""}`
        : "🏃 Retiro en local";

    const message = [
      `🛒 *Nuevo pedido* — ${config?.name ?? "LoDeFacu"}`,
      ...lines,
      delivery,
      `💰 *Total: $${total.toLocaleString("es-AR")}*`,
      ...(note.trim() ? [`📝 ${note.trim()}`] : []),
    ].join("\n");

    return `https://wa.me/${config?.whatsapp ?? ""}?text=${encodeURIComponent(message)}`;
  };

  const canConfirm =
    items.length > 0 &&
    (deliveryType === "pickup" ||
      (isOpen && zone !== null && address.trim().length > 0));

  const handleConfirm = () => {
    window.open(buildWhatsAppMessage(), "_blank");
    clearCart();
  };

  return (
    <div className="cart-summary">

      <div className="delivery-options">
        <button
          className={`delivery-btn ${deliveryType === "delivery" ? "delivery-btn--active" : ""}`}
          onClick={() => { setDeliveryType("delivery" as DeliveryType); }}
          disabled={!isOpen}
        >
          Delivery {!isOpen && "· Cerrado"}
        </button>
        <button
          className={`delivery-btn ${deliveryType === "pickup" ? "delivery-btn--active" : ""}`}
          onClick={() => { setDeliveryType("pickup" as DeliveryType); }}
        >
          Retiro en local
        </button>
      </div>

      {!isOpen && deliveryType === "delivery" && (
        <p className="cart-summary__hint cart-summary__hint--closed">
          🔴 Delivery cerrado · Abre a las {config?.delivery_open_time ?? "20:00"} · Podés elegir Retiro en local
        </p>
      )}

      {deliveryType === "delivery" && isOpen && (
        <div className="zone-selector">
          {zones.map((z) => (
            <button
              key={z.id}
              className={`zone-btn ${zone === z.id ? "zone-btn--active" : ""}`}
              onClick={() => setZone(z.id)}
            >
              {z.label} · ${z.price.toLocaleString("es-AR")}
            </button>
          ))}
        </div>
      )}

      {deliveryType === "delivery" && isOpen && (
        <input
          className="cart-note__input"
          type="text"
          placeholder="Tu dirección (ej: Recondo 298, piso 3)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          maxLength={80}
        />
      )}

      <div className="cart-summary__totals">
        <div className="cart-summary__row">
          <span>Subtotal</span>
          <span>${subtotal.toLocaleString("es-AR")}</span>
        </div>
        {deliveryType === "delivery" && isOpen && (
          <div className="cart-summary__row">
            <span>Delivery{selectedZone ? ` · ${selectedZone.label}` : ""}</span>
            <span>
              {selectedZone ? `$${deliveryCost.toLocaleString("es-AR")}` : "Seleccioná zona"}
            </span>
          </div>
        )}
        <div className="cart-summary__row cart-summary__row--total">
          <span>Total</span>
          <span>${total.toLocaleString("es-AR")}</span>
        </div>
      </div>

      <input
        className="cart-note__input"
        type="text"
        placeholder="¿Alguna aclaración? (sin cebolla, extra salsa...)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        maxLength={120}
      />

      <button
        className="whatsapp-btn"
        onClick={handleConfirm}
        disabled={!canConfirm}
        aria-label="Confirmar pedido por WhatsApp"
      >
        Confirmar por WhatsApp
      </button>

      {isOpen && deliveryType === "delivery" && (!zone || !address.trim()) && (
        <p className="cart-summary__hint">
          {!zone ? "Seleccioná una zona" : "Ingresá tu dirección"} para continuar
        </p>
      )}

    </div>
  );
}
