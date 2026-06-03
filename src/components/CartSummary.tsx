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
    hasPickupOnlyItems, // ← nuevo
  } = useCart();

  const { zones } = useDeliveryZones();
  const { isOpen } = useStoreStatus(
    config?.delivery_open_time ?? "20:00",
    config?.delivery_close_time ?? "00:00",
  );

  const selectedZone = zones.find((z) => z.id === zone);
  const deliveryCost =
    deliveryType === "delivery" ? (selectedZone?.price ?? 0) : 0;
  const total = subtotal + deliveryCost;

  const minOrder = config?.delivery_min_order ?? 0;
  const meetsMinOrder =
    deliveryType === "pickup" || minOrder === 0 || subtotal >= minOrder;
  const remaining = minOrder - subtotal;

  // Si hay items pickup_only, forzar retiro
  const deliveryBlocked = hasPickupOnlyItems;

  const buildWhatsAppMessage = () => {
    const lines = items.map((i) => {
      const variantStr = i.variantLabel ? ` (${i.variantLabel})` : "";
      return `• ${i.name}${variantStr} x${i.qty} — $${(i.price * i.qty).toLocaleString("es-AR")}`;
    });
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
    meetsMinOrder &&
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
          onClick={() => {
            if (!deliveryBlocked) setDeliveryType("delivery" as DeliveryType);
          }}
          disabled={!isOpen || deliveryBlocked}
          title={
            deliveryBlocked
              ? "Tu pedido tiene productos solo disponibles para retiro"
              : undefined
          }
        >
          Delivery {!isOpen && "· Cerrado"}
        </button>
        <button
          className={`delivery-btn ${deliveryType === "pickup" ? "delivery-btn--active" : ""}`}
          onClick={() => {
            setDeliveryType("pickup" as DeliveryType);
          }}
        >
          Retiro en local
        </button>
      </div>

      {/* Aviso pickup_only — tiene prioridad sobre el aviso de cerrado */}
      {deliveryBlocked && (
        <p className="cart-summary__hint cart-summary__hint--pickup-only">
          🏪 Tu pedido tiene productos que son solo para retiro en local
        </p>
      )}

      {!deliveryBlocked && !isOpen && deliveryType === "delivery" && (
        <p className="cart-summary__hint cart-summary__hint--closed">
          🔴 Delivery cerrado · Abre a las{" "}
          {config?.delivery_open_time ?? "20:00"} · Podés elegir Retiro en local
        </p>
      )}

      {deliveryType === "delivery" && isOpen && !deliveryBlocked && (
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

      {deliveryType === "delivery" && isOpen && !deliveryBlocked && (
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
        {deliveryType === "delivery" && isOpen && !deliveryBlocked && (
          <div className="cart-summary__row">
            <span>
              Delivery{selectedZone ? ` · ${selectedZone.label}` : ""}
            </span>
            <span>
              {selectedZone
                ? `$${deliveryCost.toLocaleString("es-AR")}`
                : "Seleccioná zona"}
            </span>
          </div>
        )}
        <div className="cart-summary__row cart-summary__row--total">
          <span>Total</span>
          <span>${total.toLocaleString("es-AR")}</span>
        </div>
      </div>

      {deliveryType === "delivery" &&
        isOpen &&
        !deliveryBlocked &&
        !meetsMinOrder && (
          <p className="cart-summary__hint cart-summary__hint--min-order">
            🛒 Mínimo de pedido ${minOrder.toLocaleString("es-AR")} · Te faltan
            ${remaining.toLocaleString("es-AR")}
          </p>
        )}

      <input
        className="cart-note__input"
        type="text"
        placeholder="¿Alguna aclaración?"
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

      {isOpen &&
        !deliveryBlocked &&
        deliveryType === "delivery" &&
        meetsMinOrder &&
        (!zone || !address.trim()) && (
          <p className="cart-summary__hint">
            {!zone ? "Seleccioná una zona" : "Ingresá tu dirección"} para
            continuar
          </p>
        )}
    </div>
  );
}
