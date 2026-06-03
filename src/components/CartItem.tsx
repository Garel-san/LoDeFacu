import { useCart } from "../context/CartContext";
import type { CartItem as CartItemType } from "../context/CartContext";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { addItem, removeItem, deleteItem, items } = useCart();

  // max_qty viaja en el ítem como campo extra
  const maxQty = typeof item.max_qty === "number" ? item.max_qty : null;

  // Para productos con variantes, el límite aplica sobre el total del producto base
  const totalQtyForProduct = items
    .filter((i) => i.id === item.id)
    .reduce((sum, i) => sum + i.qty, 0);

  const maxReached = maxQty !== null && totalQtyForProduct >= maxQty;

  return (
    <div className="cart-item">
      {item.image ? (
        <img src={item.image} alt={item.name} className="cart-item__img" />
      ) : (
        <div className="cart-item__img cart-item__img--placeholder">🏷️</div>
      )}
      <div className="cart-item__info">
        <p className="cart-item__name">{item.name}</p>
        {item.variantLabel && (
          <p className="cart-item__variant">{String(item.variantLabel)}</p>
        )}
        <p className="cart-item__price">
          ${(item.price * item.qty).toLocaleString("es-AR")}
        </p>
      </div>
      <div className="cart-item__controls">
        <button
          className="qty-btn"
          onClick={() => removeItem(item.cartKey)}
          aria-label={`Quitar un ${item.name}`}
        >
          −
        </button>
        <span className="cart-item__qty">{item.qty}</span>
        <button
          className="qty-btn"
          onClick={() => addItem(item)}
          disabled={maxReached}
          aria-label={`Agregar otro ${item.name}`}
          title={maxReached ? `Límite de ${maxQty} por pedido` : undefined}
        >
          +
        </button>
        <button
          className="delete-btn"
          onClick={() => deleteItem(item.cartKey)}
          aria-label={`Eliminar ${item.name} del carrito`}
        >
          🗑
        </button>
      </div>
    </div>
  );
}
