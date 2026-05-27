import type { StoreConfig } from "../hooks/useStoreConfig";

interface FooterProps {
  config: StoreConfig | null;
}

export function Footer({ config }: FooterProps) {
  const year = new Date().getFullYear();
  const storeName = config?.name || "LoDeFacu";
  const whatsappUrl = config?.whatsapp ? `https://wa.me/${config.whatsapp}` : "";
  const deliveryHours =
    config?.delivery_open_time && config?.delivery_close_time
      ? `${config.delivery_open_time} - ${config.delivery_close_time}hs`
      : "Consultar horario";

  return (
    <footer className="client-footer">
      <div className="client-footer__main">
        <div className="client-footer__brand">
          <p className="client-footer__name">{storeName}</p>
          <p className="client-footer__tagline">
            Pedidos simples, sabores de siempre.
          </p>
        </div>

        <div className="client-footer__info" aria-label="Informacion del local">
          {config?.address && (
            <p className="client-footer__item">
              <span className="client-footer__dot" />
              {config.address}
            </p>
          )}

          <p className="client-footer__item">
            <span className="client-footer__dot" />
            Delivery {deliveryHours}
          </p>

          {whatsappUrl && (
            <a
              className="client-footer__link"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          )}
        </div>
      </div>

      <div className="client-footer__bottom">
        <p>Creado por Garel</p>
        <p>
          © {year} {storeName}
        </p>
      </div>
    </footer>
  );
}
