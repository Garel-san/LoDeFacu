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
  return (
    <div className="promo-bar">
      <p className="promo-label">{promo.label}</p>
      <p className="promo-title">{promo.title}</p>
      <div className="promo-prices">
        <span className="promo-price">${promo.price.toLocaleString("es-AR")}</span>
        <span className="promo-original">${promo.originalPrice.toLocaleString("es-AR")}</span>
      </div>
    </div>
  );
}
