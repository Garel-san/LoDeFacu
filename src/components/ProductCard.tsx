import { useState } from "react";
import { useCart } from "../context/CartContext";
import type { Product, ProductVariant } from "../hooks/useProducts";

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
  const [showVariantModal, setShowVariantModal] = useState(false);

  const hasVariants = product.variants.length > 0;

  // Cantidad total de este producto en el carrito (todas sus variantes sumadas)
  const totalQty = items
    .filter((i) => i.id === product.id)
    .reduce((sum, i) => sum + i.qty, 0);

  // Límite de cantidad alcanzado (solo aplica a productos sin variantes)
  const maxReached =
    !hasVariants && product.max_qty !== null && totalQty >= product.max_qty;

  const handleAdd = () => {
    if (maxReached) return;
    if (hasVariants) {
      setShowVariantModal(true);
      return;
    }

    addItem({
      id: product.id,
      cartKey: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image_url,
      pickup_only: product.pickup_only,
      max_qty: product.max_qty,
    });
  };

  const handleAddVariant = (variant: ProductVariant) => {
    addItem({
      id: product.id,
      cartKey: `${product.id}-v${variant.id}`,
      name: product.name,
      price: variant.price,
      image: product.image_url,
      variantLabel: variant.label,
      pickup_only: product.pickup_only,
      max_qty: product.max_qty,
    });

    setShowVariantModal(false);
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

  const displayPrice = hasVariants
    ? Math.min(
        ...product.variants.filter((v) => v.available).map((v) => v.price),
      )
    : product.price;

  return (
    <>
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
            {product.pickup_only && (
              <span className="badge badge--pickup">Solo retiro</span>
            )}
          </div>
          <p className="product-card__description">{product.description}</p>
        </div>
        <div className="product-card__footer">
          <p className="product-card__price">
            {hasVariants ? "Desde " : ""}$
            {displayPrice.toLocaleString("es-AR")}
          </p>
        </div>
        <button
          className="add-btn"
          onClick={handleAdd}
          disabled={maxReached}
          aria-label={`Agregar ${product.name} al carrito`}
          title={
            maxReached ? `Límite de ${product.max_qty} por pedido` : undefined
          }
        >
          {maxReached ? "−" : totalQty > 0 ? totalQty : "+"}
        </button>
      </div>

      {showVariantModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowVariantModal(false)}
        >
          <div
            className="modal variant-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.name}
                className="variant-modal__img"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
            <h2 className="modal__title">{product.name}</h2>
            {product.description && (
              <p className="variant-modal__description">
                {product.description}
              </p>
            )}
            {product.pickup_only && (
              <p className="variant-modal__pickup-notice">
                🏪 Este producto es solo para retiro en local
              </p>
            )}
            <p className="variant-modal__label">Elegí una opción</p>
            <div className="variant-list">
              {product.variants
                .filter((v) => v.available)
                .map((v) => {
                  const qtyInCart =
                    items.find((i) => i.cartKey === `${product.id}-v${v.id}`)
                      ?.qty ?? 0;
                  // max_qty para variantes: aplica sobre el total del producto base
                  const variantMaxReached =
                    product.max_qty !== null && totalQty >= product.max_qty;
                  return (
                    <button
                      key={v.id}
                      className="variant-option"
                      onClick={() => !variantMaxReached && handleAddVariant(v)}
                      disabled={variantMaxReached}
                    >
                      <span className="variant-option__label">{v.label}</span>
                      <span className="variant-option__right">
                        <span className="variant-option__price">
                          ${v.price.toLocaleString("es-AR")}
                        </span>
                        {qtyInCart > 0 && (
                          <span className="variant-option__qty">
                            {qtyInCart} en carrito
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
            </div>
            <button
              className="btn btn--ghost variant-modal__close"
              onClick={() => setShowVariantModal(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
