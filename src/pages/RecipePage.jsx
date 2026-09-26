import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { recipeApi, ApiError } from '../api/recipeApi';
import { useApp } from '../context/AppContext.jsx';
import { useRecipeProgress } from '../hooks/useRecipeProgress';
import { formatLabel } from '../api/constants';

export default function RecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { findCachedRecipe, isSaved, addToLibrary, removeFromLibrary } = useApp();

  const [recipe, setRecipe] = useState(() => findCachedRecipe(id));
  const [loading, setLoading] = useState(!recipe);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (recipe) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    recipeApi
      .getRecipe(id)
      .then((res) => {
        if (!cancelled) setRecipe(res.data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Could not load this recipe.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const { progress, toggleIngredient, toggleStep } = useRecipeProgress(id);

  if (loading) return <div className="empty-state">Loading recipe…</div>;
  if (error) {
    return (
      <div>
        <button className="back-link" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="error-banner">{error}</div>
      </div>
    );
  }
  if (!recipe) {
    return (
      <div>
        <button className="back-link" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="empty-state">Recipe not found.</div>
      </div>
    );
  }

  const saved = isSaved(recipe.id);

  return (
    <div>
      <button className="back-link" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="recipe-header">
        <div>
          <h1 className="recipe-title">{recipe.name}</h1>
          <p className="recipe-desc" style={{ WebkitLineClamp: 'unset' }}>
            {recipe.description}
          </p>
        </div>
        {saved ? (
          <button className="btn btn-danger" onClick={() => removeFromLibrary(recipe.id)}>
            Remove from library
          </button>
        ) : (
          <button className="btn btn-accent" onClick={() => addToLibrary(recipe)}>
            Save to library
          </button>
        )}
      </div>

      <div className="recipe-meta">
        {recipe.cuisine && <span className="tag">{formatLabel(recipe.cuisine)}</span>}
        {recipe.meal_type && <span className="tag">{formatLabel(recipe.meal_type)}</span>}
        {recipe.difficulty && <span className="tag">{formatLabel(recipe.difficulty)}</span>}
        {typeof recipe.servings === 'number' && (
          <span className="tag">{recipe.servings} servings</span>
        )}
        {typeof recipe.prep_time === 'number' && (
          <span className="tag">Prep {recipe.prep_time} min</span>
        )}
        {typeof recipe.cook_time === 'number' && (
          <span className="tag">Cook {recipe.cook_time} min</span>
        )}
        {typeof recipe.calories_per_serving === 'number' && (
          <span className="tag">{recipe.calories_per_serving} kcal/serving</span>
        )}
        {(recipe.dietary_tags || []).map((tag) => (
          <span className="tag" key={tag}>
            {formatLabel(tag)}
          </span>
        ))}
      </div>

      <h2 className="section-title">Ingredients</h2>
      <ul className="check-list">
        {(recipe.ingredients || []).map((ingredient) => {
          const key = ingredient.id ?? ingredient.name;
          const done = progress.ingredients.includes(key);
          return (
            <li
              key={key}
              className={done ? 'check-item done' : 'check-item'}
              onClick={() => toggleIngredient(key)}
            >
              <span className="check-box">{done ? '✓' : ''}</span>
              <span>
                {ingredient.quantity ? `${ingredient.quantity} ` : ''}
                {ingredient.unit ? `${ingredient.unit} ` : ''}
                {ingredient.name}
                {ingredient.optional ? ' (optional)' : ''}
              </span>
            </li>
          );
        })}
      </ul>

      <h2 className="section-title">Steps</h2>
      <ul className="check-list">
        {(recipe.instructions || []).map((step, index) => {
          const done = progress.steps.includes(index);
          return (
            <li
              key={index}
              className={done ? 'check-item done' : 'check-item'}
              onClick={() => toggleStep(index)}
            >
              <span className="check-box">{done ? '✓' : ''}</span>
              <span className="step-index">{index + 1}.</span>
              <span>{step}</span>
            </li>
          );
        })}
      </ul>

      <p style={{ marginTop: '2rem' }}>
        <Link to="/" className="back-link">
          ← Back to search
        </Link>
      </p>
    </div>
  );
}
