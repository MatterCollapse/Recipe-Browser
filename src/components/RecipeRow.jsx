import { useNavigate } from 'react-router-dom';

export default function RecipeRow({ recipe, saved, onToggleSave, saveLabel, removeLabel }) {
  const navigate = useNavigate();

  return (
    <li className="recipe-row">
      <button className="recipe-row-main" onClick={() => navigate(`/recipe/${recipe.id}`)}>
        <p className="recipe-name">{recipe.name}</p>
        <p className="recipe-desc">{recipe.description}</p>
      </button>
      <div className="recipe-row-actions">
        {saved ? (
          <button className="btn btn-danger btn-small" onClick={() => onToggleSave(recipe)}>
            {removeLabel || 'Remove'}
          </button>
        ) : (
          <button className="btn btn-accent btn-small" onClick={() => onToggleSave(recipe)}>
            {saveLabel || 'Save'}
          </button>
        )}
      </div>
    </li>
  );
}
