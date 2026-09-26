import { createContext, useContext, useMemo, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [library, setLibrary] = useLocalStorage('recipeLibrary', []);
  const [settings, setSettings] = useLocalStorage('recipeApiSettings', { apiKey: '' });
  // Not persisted: just a lookup so opening a recipe from search results
  // doesn't require a second network call.
  const [resultsCache, setResultsCache] = useState({});

  const isSaved = (id) => library.some((r) => r.id === id);

  const addToLibrary = (recipe) => {
    setLibrary((prev) => (prev.some((r) => r.id === recipe.id) ? prev : [...prev, recipe]));
  };

  const removeFromLibrary = (id) => {
    setLibrary((prev) => prev.filter((r) => r.id !== id));
  };

  const cacheRecipes = (recipes) => {
    setResultsCache((prev) => {
      const next = { ...prev };
      recipes.forEach((r) => {
        next[r.id] = r;
      });
      return next;
    });
  };

  const findCachedRecipe = (id) => {
    const numId = Number(id);
    return library.find((r) => r.id === numId) || resultsCache[numId] || null;
  };

  const value = useMemo(
    () => ({
      library,
      setLibrary,
      isSaved,
      addToLibrary,
      removeFromLibrary,
      settings,
      setSettings,
      cacheRecipes,
      findCachedRecipe,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [library, settings, resultsCache]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside an AppProvider');
  return ctx;
}
