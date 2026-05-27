import { useState, useEffect } from "react";
import { PromoBar } from "../components/PromoBar";
import { CategoryFilter } from "../components/CategoryFilter";
import { ProductCard } from "../components/ProductCard";
import { Footer } from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useStoreStatus } from "../hooks/useStoreStatus";
import { useProducts } from "../hooks/useProducts";
import { useStoreConfig } from "../hooks/useStoreConfig";
import logo from "../assets/logo.png";

interface MenuPageProps {
  onGoToCart: () => void;
}

const ALL_CATEGORY = { id: "todo", label: "Todo", position: 0 };

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isDesktop;
}

export function MenuPage({ onGoToCart }: MenuPageProps) {
  const [activeCategory, setActiveCategory] = useState("todo");
  const { totalCount, subtotal } = useCart();
  const { products, categories, loading, error } = useProducts();
  const { config } = useStoreConfig();
  const isDesktop = useIsDesktop();
  const { isOpen, label } = useStoreStatus(
    config?.delivery_open_time ?? "20:00",
    config?.delivery_close_time ?? "00:00",
  );

  const allCategories = [ALL_CATEGORY, ...categories];
  const filtered =
    activeCategory === "todo"
      ? products
      : products.filter((p) => p.category_id === activeCategory);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: config?.name ?? "LoDeFacu",
        text: `Pedí en ${config?.name ?? "LoDeFacu"} — delivery rápido 🛵`,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("¡Link copiado!");
    }
  };

  const whatsappUrl = `https://wa.me/${config?.whatsapp ?? ""}`;
  const mapsUrl = config?.address
    ? `https://www.google.com/maps?q=${encodeURIComponent(config.address)}&output=embed`
    : null;

  const promoBar = config?.promo_active ? (
    <PromoBar
      promo={{
        label: config.promo_label,
        title: config.promo_title,
        price: config.promo_price,
        originalPrice: config.promo_original_price,
      }}
    />
  ) : null;

  const categoryFilter = (
    <CategoryFilter
      categories={allCategories}
      active={activeCategory}
      onChange={setActiveCategory}
    />
  );

  const productList = (
    <>
      {loading && <div className="status-msg">Cargando productos...</div>}
      {error && <div className="status-msg status-msg--error">{error}</div>}
      {!loading &&
        !error &&
        filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
    </>
  );

  if (isDesktop) {
    return (
      <div className="client-layout">
        <nav className="desktop-nav">
          <div className="desktop-nav__brand">
            <div className="desktop-nav__logo-wrap">
              <img
                src={logo}
                alt={config?.name ?? "Logo"}
                className="desktop-nav__logo"
              />
            </div>
            <div>
              <p className="desktop-nav__name">{config?.name ?? ""}</p>
              <div
                className={`store-status ${isOpen ? "store-status--open" : "store-status--closed"}`}
              >
                <span className="store-status__dot" />
                <span className="store-status__label">{label}</span>
              </div>
            </div>
          </div>
          <div className="desktop-nav__actions">
            <a
              className="desktop-nav__btn desktop-nav__btn--wa"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Contactar
            </a>
            <button className="desktop-nav__btn" onClick={handleShare}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              Compartir
            </button>
          </div>
        </nav>

        <div className="desktop-content">
          {promoBar && <div className="desktop-promo">{promoBar}</div>}
          <div className="desktop-menu-header">
            {categoryFilter}
            <button
              className="desktop-cart-btn"
              onClick={onGoToCart}
              disabled={totalCount === 0}
            >
              🛒{" "}
              {totalCount > 0
                ? `${totalCount} producto${totalCount !== 1 ? "s" : ""} · $${subtotal.toLocaleString("es-AR")}`
                : "Carrito vacío"}
            </button>
          </div>
          <div className="desktop-product-grid">{productList}</div>
          <div className="desktop-location-box">
            <div className="desktop-map">
              {mapsUrl && (
                <iframe
                  title="Ubicación del local"
                  src={mapsUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: "var(--radius-md)" }}
                  allowFullScreen
                  loading="lazy"
                />
              )}
            </div>
            <div className="desktop-info">
              <p className="desktop-info__title">Información del local</p>
              <div className="desktop-info__row">
                <span className="desktop-info__icon">📍</span>
                <span>{config?.address ?? "Recondo 298, Fiorito"}</span>
              </div>
              <div className="desktop-info__row">
                <span className="desktop-info__icon">🛵</span>
                <div>
                  <p>Delivery</p>
                  <p className="desktop-info__sub">
                    {config?.delivery_open_time ?? "20:00"} —{" "}
                    {config?.delivery_close_time ?? "00:00"}hs
                  </p>
                  <p className="desktop-info__sub">
                    {config?.delivery_available
                      ? "Disponible"
                      : "No disponible"}
                  </p>
                </div>
              </div>
              <div className="desktop-info__row">
                <span className="desktop-info__icon">🏪</span>
                <div>
                  <p>Retiro en local</p>
                  <p className="desktop-info__sub">
                    24hs · Sin costo adicional
                  </p>
                </div>
              </div>
              <div className="desktop-info__row">
                <span className="desktop-info__icon">📱</span>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="desktop-info__wa"
                >
                  Escribinos por WhatsApp
                </a>
              </div>
            </div>
          </div>
          <Footer config={config} />
        </div>
      </div>
    );
  }

  // ── MOBILE ──
  return (
    <div className="page">
      <div className="menu-header">
        <div className="menu-header__brand">
          <div className="menu-header__logo-wrap">
            <img
              src={logo}
              alt={config?.name ?? "Logo"}
              className="menu-header__logo"
            />
          </div>
          <div>
            <p className="menu-header__store">{config?.name ?? ""}</p>
            <div
              className={`store-status ${isOpen ? "store-status--open" : "store-status--closed"}`}
            >
              <span className="store-status__dot" />
              <span className="store-status__label">{label}</span>
            </div>
          </div>
        </div>
        <div className="menu-header__actions">
          <button
            className="share-btn"
            onClick={handleShare}
            aria-label="Compartir"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
          <button
            className="cart-badge"
            onClick={onGoToCart}
            disabled={totalCount === 0}
          >
            🛒
            {totalCount > 0 && (
              <span className="cart-badge__count">{totalCount}</span>
            )}
          </button>
        </div>
      </div>

      {promoBar}
      {categoryFilter}
      <div className="product-list">{productList}</div>
      <Footer config={config} />

      {totalCount > 0 && (
        <button className="cart-bar" onClick={onGoToCart}>
          <span className="cart-bar__count">
            {totalCount} producto{totalCount !== 1 ? "s" : ""}
          </span>
          <span className="cart-bar__total">
            ${subtotal.toLocaleString("es-AR")}
          </span>
        </button>
      )}
    </div>
  );
}
