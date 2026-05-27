import { useCart } from "../context/CartContext";
import type { CartItem as CartItemType } from "../context/CartContext";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { addItem, removeItem, deleteItem } = useCart();

  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} className="cart-item__img" />
      <div className="cart-item__info">
        <p className="cart-item__name">{item.name}</p>
        <p className="cart-item__price">
          ${(item.price * item.qty).toLocaleString("es-AR")}
        </p>
      </div>
      <div className="cart-item__controls">
        <button
          className="qty-btn"
          onClick={() => removeItem(item.id)}
          aria-label={`Quitar un ${item.name}`}
        >
          −
        </button>
        <span className="cart-item__qty">{item.qty}</span>
        <button
          className="qty-btn"
          onClick={() => addItem(item)}
          aria-label={`Agregar otro ${item.name}`}
        >
          +
        </button>
        <button
          className="delete-btn"
          onClick={() => deleteItem(item.id)}
          aria-label={`Eliminar ${item.name} del carrito`}
        >
          🗑
        </button>
      </div>
    </div>
  );
}
