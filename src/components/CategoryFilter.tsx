import { useRef, useState, useEffect, useCallback } from "react";

interface Category {
  id: string;
  label: string;
}

interface CategoryFilterProps {
  categories: Category[];
  active: string;
  onChange: (categoryId: string) => void;
  showArrows?: boolean; // true en desktop, false en mobile
}

export function CategoryFilter({
  categories,
  active,
  onChange,
  showArrows = false,
}: CategoryFilterProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
    };
  }, [updateArrows, categories]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === "left" ? -160 : 160, behavior: "smooth" });
  };

  return (
    <div className={`cat-filter-wrap${showArrows ? " cat-filter-wrap--arrows" : ""}`}>
      {showArrows && (
        <button
          className="cat-arrow cat-arrow--left"
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          aria-label="Categorías anteriores"
        >
          ‹
        </button>
      )}

      <div className="category-filter" ref={scrollRef}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`cat-btn ${active === cat.id ? "cat-btn--active" : ""}`}
            onClick={() => onChange(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {showArrows && (
        <button
          className="cat-arrow cat-arrow--right"
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          aria-label="Categorías siguientes"
        >
          ›
        </button>
      )}
    </div>
  );
}
