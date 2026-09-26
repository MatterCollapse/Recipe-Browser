import { useNavigate } from 'react-router-dom';

// `action` describes the single button shown on the row:
//   { label, onClick, disabled, variant: 'accent' | 'danger' }
export default function RecipeRow({ recipe, action }) {
  const navigate = useNavigate();
  const variantClass = action.variant === 'danger' ? 'btn-danger' : 'btn-accent';

  return (
    <li className="recipe-row">
      <button className="recipe-row-main" onClick={() => navigate(`/recipe/${recipe.id}`)}>
        <p className="recipe-name">{recipe.name}</p>
        <p className="recipe-desc">{recipe.description}</p>
      </button>
      <div className="recipe-row-actions">
        <button
          className={`btn ${variantClass} btn-small`}
          onClick={action.onClick}
          disabled={action.disabled}
        >
          {action.label}
        </button>
      </div>
    </li>
  );
}
