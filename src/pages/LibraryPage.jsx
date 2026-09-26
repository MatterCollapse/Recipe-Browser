import { useRef, useState } from 'react';
import RecipeRow from '../components/RecipeRow.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function LibraryPage() {
  const { library, removeFromLibrary, setLibrary } = useApp();
  const fileInputRef = useRef(null);
  const [importError, setImportError] = useState(null);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(library, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recipe-library.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    setImportError(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!Array.isArray(parsed)) {
          throw new Error('File must contain a JSON array of recipes.');
        }
        const looksValid = parsed.every(
          (item) => item && typeof item === 'object' && 'id' in item && 'name' in item
        );
        if (!looksValid) {
          throw new Error('File does not look like a valid recipe library export.');
        }
        const confirmed = window.confirm(
          `Import ${parsed.length} recipe(s)? This will overwrite your current library of ${library.length} recipe(s).`
        );
        if (confirmed) {
          setLibrary(parsed);
          setImportError(null);
        }
      } catch (err) {
        setImportError(err.message || 'Could not import that file.');
      }
    };
    reader.readAsText(file);
    // allow re-selecting the same file later
    event.target.value = '';
  };

  return (
    <div>
      <h1 className="page-title">Library</h1>

      <div className="toolbar">
        <button className="btn" onClick={handleExport} disabled={library.length === 0}>
          Export library (JSON)
        </button>
        <button className="btn" onClick={handleImportClick}>
          Import library (JSON)
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>

      {importError && <div className="error-banner">{importError}</div>}

      {library.length === 0 ? (
        <div className="empty-state">
          No saved recipes yet. Save recipes from the Search page to see them here.
        </div>
      ) : (
        <ul className="recipe-list">
          {library.map((recipe) => (
            <RecipeRow
              key={recipe.id}
              recipe={recipe}
              saved
              onToggleSave={() => removeFromLibrary(recipe.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
