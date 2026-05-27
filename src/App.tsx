import { useState } from "react";
import { CartProvider } from "./context/CartContext";
import { MenuPage } from "./pages/MenuPage";
import { CartPage } from "./pages/CartPage";

type Page = "menu" | "cart";

export function App() {
  const [page, setPage] = useState<Page>("menu");

  return (
    <CartProvider>
      {page === "menu" ? (
        <MenuPage onGoToCart={() => setPage("cart")} />
      ) : (
        <CartPage onGoBack={() => setPage("menu")} />
      )}
    </CartProvider>
  );
}
