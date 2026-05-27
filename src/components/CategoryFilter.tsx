interface Category {
  id: string;
  label: string;
}

interface CategoryFilterProps {
  categories: Category[];
  active: string;
  onChange: (categoryId: string) => void;
}

export function CategoryFilter({ categories, active, onChange }: CategoryFilterProps) {
  return (
    <div className="category-filter">
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
  );
}
