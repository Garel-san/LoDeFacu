import { useCart } from "../context/CartContext";

interface Promo {
  label: string;
  title: string;
  price: number;
  originalPrice: number;
}

interface PromoBarProps {
  promo: Promo;
}

export function PromoBar({ promo }: PromoBarProps) {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem({
      id: -1,
      name: promo.title,
      price: promo.price,
      image: "",
    });
  };

  return (
    <div className="promo-bar">
      <p className="promo-label">{promo.label}</p>
      <div className="promo-bar__body">
        <div>
          <p className="promo-title">{promo.title}</p>
          <div className="promo-prices">
            <span className="promo-price">
              ${promo.price.toLocaleString("es-AR")}
            </span>
            <span className="promo-original">
              ${promo.originalPrice.toLocaleString("es-AR")}
            </span>
          </div>
        </div>
        <button
          className="add-btn"
          onClick={handleAdd}
          aria-label="Agregar promo"
        >
          +
        </button>
      </div>
    </div>
  );
}
