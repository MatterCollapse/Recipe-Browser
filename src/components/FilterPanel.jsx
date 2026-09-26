import { CUISINES, DIETARY_TAGS, COMMON_INGREDIENTS, formatLabel } from '../api/constants';

export default function FilterPanel({ filters, onChange }) {
  const set = (patch) => onChange({ ...filters, ...patch });

  const toggleIngredient = (ingredient) => {
    const has = filters.ingredients.includes(ingredient);
    set({
      ingredients: has
        ? filters.ingredients.filter((i) => i !== ingredient)
        : [...filters.ingredients, ingredient],
    });
  };

  return (
    <div className="filter-panel">
      <div className="filter-row">
        <div className="field" style={{ flex: 2 }}>
          <label htmlFor="search">Search recipes</label>
          <input
            id="search"
            type="text"
            placeholder="e.g. chicken curry"
            value={filters.search}
            onChange={(e) => set({ search: e.target.value })}
          />
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={filters.searchDescription}
              onChange={(e) => set({ searchDescription: e.target.checked })}
            />
            Also search descriptions
          </label>
        </div>

        <div className="field">
          <label htmlFor="cuisine">Cuisine</label>
          <select
            id="cuisine"
            value={filters.cuisine}
            onChange={(e) => set({ cuisine: e.target.value })}
          >
            <option value="">Any cuisine</option>
            {CUISINES.map((c) => (
              <option key={c} value={c}>
                {formatLabel(c)}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="diet">Diet / health</label>
          <select id="diet" value={filters.diet} onChange={(e) => set({ diet: e.target.value })}>
            <option value="">Any diet</option>
            {DIETARY_TAGS.map((d) => (
              <option key={d} value={d}>
                {formatLabel(d)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label>Common ingredients</label>
        <div className="chip-grid">
          {COMMON_INGREDIENTS.map((ingredient) => {
            const selected = filters.ingredients.includes(ingredient);
            return (
              <button
                key={ingredient}
                type="button"
                className={selected ? 'chip selected' : 'chip'}
                onClick={() => toggleIngredient(ingredient)}
              >
                {ingredient}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
