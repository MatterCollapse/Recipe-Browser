import { useLocalStorage } from './useLocalStorage';

// Remembers which ingredients/steps are checked off for a given recipe,
// so progress survives navigating away and coming back.
export function useRecipeProgress(recipeId) {
  const [progress, setProgress] = useLocalStorage(`recipeProgress:${recipeId}`, {
    ingredients: [],
    steps: [],
  });

  const toggleIngredient = (ingredientKey) => {
    setProgress((prev) => {
      const has = prev.ingredients.includes(ingredientKey);
      return {
        ...prev,
        ingredients: has
          ? prev.ingredients.filter((k) => k !== ingredientKey)
          : [...prev.ingredients, ingredientKey],
      };
    });
  };

  const toggleStep = (index) => {
    setProgress((prev) => {
      const has = prev.steps.includes(index);
      return {
        ...prev,
        steps: has ? prev.steps.filter((i) => i !== index) : [...prev.steps, index],
      };
    });
  };

  return { progress, toggleIngredient, toggleStep };
}
