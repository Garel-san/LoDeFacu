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
  const [search, setSearch] = useState("");

  const { totalCount, subtotal } = useCart();
  const { products, categories, loading, error } = useProducts();
  const { config } = useStoreConfig();
  const isDesktop = useIsDesktop();

  const { isOpen, label } = useStoreStatus(
    config?.delivery_open_time ?? "20:00",
    config?.delivery_close_time ?? "00:00",
  );

  const allCategories = [ALL_CATEGORY, ...categories];

  // ✅ FILTRO ACTUALIZADO (categoría + búsqueda)
  const filtered = products
    .filter(
      (p) => activeCategory === "todo" || p.category_id === activeCategory,
    )
    .filter((p) => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    });

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
    ? `https://www.google.com/maps?q=${encodeURIComponent(
        config.address,
      )}&output=embed`
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

  const searchAndFilterMobile = (
    <>
      <div className="search-wrap">
        <input
          className="search-input"
          type="search"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Buscar producto"
        />
      </div>

      <CategoryFilter
        categories={allCategories}
        active={activeCategory}
        onChange={(cat) => {
          setActiveCategory(cat);
          setSearch("");
        }}
        showArrows={false}
      />
    </>
  );

  const searchAndFilterDesktop = (
    <>
      <div className="search-wrap">
        <input
          className="search-input"
          type="search"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Buscar producto"
        />
      </div>

      <CategoryFilter
        categories={allCategories}
        active={activeCategory}
        onChange={(cat) => {
          setActiveCategory(cat);
          setSearch("");
        }}
        showArrows={true}
      />
    </>
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

  // ── DESKTOP ──
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
                className={`store-status ${
                  isOpen ? "store-status--open" : "store-status--closed"
                }`}
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
              Contactar
            </a>

            <button className="desktop-nav__btn" onClick={handleShare}>
              Compartir
            </button>
          </div>
        </nav>

        <div className="desktop-content">
          {promoBar && <div className="desktop-promo">{promoBar}</div>}

          <div className="desktop-menu-header">
            <div className="desktop-menu-header__filters">
              {searchAndFilterDesktop}
            </div>

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
        </div>

        <Footer config={config} />
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
              className={`store-status ${
                isOpen ? "store-status--open" : "store-status--closed"
              }`}
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
            🔗
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

      {searchAndFilterMobile}

      <div className="product-list">{productList}</div>

      {mapsUrl && (
        <div className="mobile-map">
          <iframe
            title="Ubicación del local"
            src={mapsUrl}
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: "var(--radius-md)" }}
            allowFullScreen
            loading="lazy"
          />
        </div>
      )}

      <Footer config={config} />

      {totalCount > 0 && (
        <button className="cart-bar" onClick={onGoToCart}>
          <span className="cart-bar__count">
            {totalCount} producto
            {totalCount !== 1 ? "s" : ""}
          </span>
          <span className="cart-bar__total">
            ${subtotal.toLocaleString("es-AR")}
          </span>
        </button>
      )}
    </div>
  );
}
