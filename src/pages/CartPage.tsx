import { useState, useEffect } from "react";
import { CartItem } from "../components/CartItem";
import { CartSummary } from "../components/CartSummary";
import { Footer } from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useStoreConfig } from "../hooks/useStoreConfig";
import logo from "../assets/logo.png";

interface CartPageProps {
  onGoBack: () => void;
}

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

export function CartPage({ onGoBack }: CartPageProps) {
  const { items } = useCart();
  const { config } = useStoreConfig();
  const isDesktop = useIsDesktop();

  const emptyState = (
    <div className="cart-empty">
      <span className="cart-empty__icon">🛒</span>
      <p className="cart-empty__text">Tu carrito está vacío</p>
      <button className="cart-empty__btn" onClick={onGoBack}>
        Ver menú
      </button>
    </div>
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
            <p className="desktop-nav__name">{config?.name ?? ""}</p>
          </div>
          <div className="desktop-nav__actions">
            <button className="desktop-nav__btn" onClick={onGoBack}>
              ← Volver al menú
            </button>
          </div>
        </nav>
        <div className="desktop-content">
          {items.length === 0 ? (
            emptyState
          ) : (
            <div className="desktop-cart-layout">
              <div className="desktop-cart-items">
                <p className="desktop-cart-section-title">Tu pedido</p>
                <div className="cart-list">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
              <div className="desktop-cart-summary-wrap">
                <p className="desktop-cart-section-title">Resumen</p>
                <CartSummary config={config} />
              </div>
            </div>
          )}
          <Footer config={config} />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="cart-header">
        <button
          className="back-btn"
          onClick={onGoBack}
          aria-label="Volver al menú"
        >
          ←
        </button>
        <p className="cart-header__title">Tu pedido</p>
      </div>
      {items.length === 0 ? (
        emptyState
      ) : (
        <>
          <div className="cart-list">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
          <CartSummary config={config} />
        </>
      )}
      <Footer config={config} />
    </div>
  );
}
