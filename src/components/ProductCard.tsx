import { useCart } from "../context/CartContext";
import type { Product } from "../hooks/useProducts";

interface ProductCardProps {
  product: Product;
}

const BADGE_LABEL: Record<string, string> = {
  popular: "Popular",
  nuevo: "Nuevo",
};

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%230e3422'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='32'%3E🍽%3C/text%3E%3C/svg%3E";

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, items } = useCart();

  const cartItem = items.find((i) => i.id === product.id);
  const qty = cartItem?.qty ?? 0;

  // Adaptar Product de Supabase al shape que espera el carrito
  const productForCart = {
    ...product,
    image: product.image_url,
    category: product.category_id,
  };

  if (!product.available) {
    return (
      <div className="product-card product-card--unavailable">
        <div className="product-card__img-wrap">
          <img
            src={product.image_url || PLACEHOLDER}
            alt={product.name}
            className="product-card__img"
            onError={(e) => {
              e.currentTarget.src = PLACEHOLDER;
            }}
          />
        </div>
        <div className="product-card__info">
          <p className="product-card__name">{product.name}</p>
          <p className="product-card__description">{product.description}</p>
          <span className="badge badge--agotado">Agotado</span>
        </div>
      </div>
    );
  }

  return (
    <div className="product-card">
      <div className="product-card__img-wrap">
        <img
          src={product.image_url || PLACEHOLDER}
          alt={product.name}
          className="product-card__img"
          onError={(e) => {
            e.currentTarget.src = PLACEHOLDER;
          }}
        />
      </div>
      <div className="product-card__info">
        <div className="product-card__header">
          <p className="product-card__name">{product.name}</p>
          {product.badge && (
            <span className={`badge badge--${product.badge}`}>
              {BADGE_LABEL[product.badge]}
            </span>
          )}
        </div>
        <p className="product-card__description">{product.description}</p>
        <p className="product-card__price">
          ${product.price.toLocaleString("es-AR")}
        </p>
      </div>
      <button
        className="add-btn"
        onClick={() => addItem(productForCart)}
        aria-label={`Agregar ${product.name} al carrito`}
      >
        {qty > 0 ? qty : "+"}
      </button>
    </div>
  );
}
