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

export default function SearchPage() {
  const { isSaved, addToLibrary, removeFromLibrary, cacheRecipes } = useApp();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [recipes, setRecipes] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKeyPresent = hasApiKey();

  // Reset to page 1 whenever filters change.
  useEffect(() => {
    setPage(1);
  }, [
    filters.search,
    filters.searchDescription,
    filters.cuisine,
    filters.diet,
    filters.ingredients.join(','),
  ]);

  useEffect(() => {
    if (!apiKeyPresent) return;

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          search: filters.search || undefined,
          search_in: filters.search
            ? filters.searchDescription
              ? 'both'
              : 'name'
            : undefined,
          cuisine: filters.cuisine || undefined,
          dietary_tags: filters.diet || undefined,
          ingredients: filters.ingredients.length ? filters.ingredients : undefined,
          per_page: 10,
          page,
        };
        const res = await recipeApi.listRecipes(params);
        setRecipes(res.data || []);
        setMeta(res.meta || null);
        cacheRecipes(res.data || []);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Something went wrong.');
        setRecipes([]);
        setMeta(null);
      } finally {
        setLoading(false);
      }
    }, 350); // debounce so typing doesn't fire a request per keystroke

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    apiKeyPresent,
    filters.search,
    filters.searchDescription,
    filters.cuisine,
    filters.diet,
    filters.ingredients.join(','),
    page,
  ]);

  const handleToggleSave = (recipe) => {
    if (isSaved(recipe.id)) {
      removeFromLibrary(recipe.id);
    } else {
      addToLibrary(recipe);
    }
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
    if (loading && recipes.length === 0) {
      return <div className="empty-state">Loading recipes…</div>;
    }
    if (!loading && recipes.length === 0) {
      return <div className="empty-state">No recipes match those filters.</div>;
    }
    return (
      <ul className="recipe-list">
        {recipes.map((recipe) => (
          <RecipeRow
            key={recipe.id}
            recipe={recipe}
            saved={isSaved(recipe.id)}
            onToggleSave={handleToggleSave}
          />
        ))}
      </ul>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKeyPresent, error, loading, recipes]);

  return (
    <div>
      <h1 className="page-title">Search recipes</h1>
      <FilterPanel filters={filters} onChange={setFilters} />
      {content}
      {apiKeyPresent && !error && (
        <Pagination
          page={page}
          lastPage={meta?.last_page}
          total={meta?.total}
          onChange={setPage}
        />
      )}
    </div>
  );
}
