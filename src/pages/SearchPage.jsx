import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { recipeApi, hasApiKey, ApiError } from '../api/recipeApi';
import FilterPanel from '../components/FilterPanel.jsx';
import RecipeRow from '../components/RecipeRow.jsx';
import Pagination from '../components/Pagination.jsx';
import { useApp } from '../context/AppContext.jsx';

const DEFAULT_FILTERS = {
  search: '',
  searchDescription: false,
  cuisine: '',
  diet: '',
  ingredients: [],
};

function toParams(filters, page) {
  return {
    search: filters.search || undefined,
    search_in: filters.search ? (filters.searchDescription ? 'both' : 'name') : undefined,
    cuisine: filters.cuisine || undefined,
    dietary_tags: filters.diet || undefined,
    ingredients: filters.ingredients.length ? filters.ingredients : undefined,
    per_page: 10,
    page,
  };
}

export default function SearchPage() {
  const { isSaved, addToLibrary, cacheRecipes, library } = useApp();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  // The filters + page that were last actually submitted to the API.
  // Only changes on "Search" click or a pagination click, never on every
  // keystroke/dropdown change, so we don't burn API quota unnecessarily.
  const [appliedQuery, setAppliedQuery] = useState({ filters: DEFAULT_FILTERS, page: 1 });
  const [recipes, setRecipes] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKeyPresent = hasApiKey();

  useEffect(() => {
    if (!apiKeyPresent) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    recipeApi
      .listRecipes(toParams(appliedQuery.filters, appliedQuery.page))
      .then((res) => {
        if (cancelled) return;
        setRecipes(res.data || []);
        setMeta(res.meta || null);
        cacheRecipes(res.data || []);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : 'Something went wrong.');
        setRecipes([]);
        setMeta(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKeyPresent, appliedQuery]);

  const handleSearch = () => {
    setAppliedQuery({ filters, page: 1 });
  };

  const handlePageChange = (nextPage) => {
    setAppliedQuery((prev) => ({ ...prev, page: nextPage }));
  };

  const handleSave = (recipe) => {
    addToLibrary(recipe);
  };

  const content = useMemo(() => {
    if (!apiKeyPresent) {
      return (
        <div className="hint-banner">
          You need a Recipe API key to search. Add one on the{' '}
          <Link to="/settings">Settings</Link> page.
        </div>
      );
    }
    if (error) {
      return <div className="error-banner">{error}</div>;
    }
    if (loading) {
      return <div className="empty-state">Loading recipes…</div>;
    }
    if (recipes.length === 0) {
      return <div className="empty-state">No recipes match those filters.</div>;
    }
    return (
      <ul className="recipe-list">
        {recipes.map((recipe) => {
          const saved = isSaved(recipe.id);
          return (
            <RecipeRow
              key={recipe.id}
              recipe={recipe}
              action={
                saved
                  ? { label: 'Saved ✓', disabled: true, variant: 'accent' }
                  : { label: 'Save', onClick: () => handleSave(recipe), variant: 'accent' }
              }
            />
          );
        })}
      </ul>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKeyPresent, error, loading, recipes, library]);

  return (
    <div>
      <h1 className="page-title">Search recipes</h1>
      <FilterPanel filters={filters} onChange={setFilters} />
      <div className="toolbar" style={{ marginTop: '0.9rem' }}>
        <button className="btn btn-accent" onClick={handleSearch} disabled={!apiKeyPresent}>
          Search
        </button>
      </div>
      {content}
      {apiKeyPresent && !error && !loading && (
        <Pagination
          page={appliedQuery.page}
          lastPage={meta?.last_page}
          total={meta?.total}
          onChange={handlePageChange}
        />
      )}
    </div>
  );
}
