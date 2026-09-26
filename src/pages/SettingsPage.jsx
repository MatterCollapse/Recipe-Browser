import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { recipeApi, ApiError } from '../api/recipeApi';

export default function SettingsPage() {
  const { settings, setSettings } = useApp();
  const [apiKey, setApiKey] = useState(settings.apiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testState, setTestState] = useState({ status: 'idle', message: '' });

  const handleSave = (e) => {
    e.preventDefault();
    setSettings({ ...settings, apiKey: apiKey.trim() });
    setSaved(true);
    setTestState({ status: 'idle', message: '' });
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTest = async () => {
    setTestState({ status: 'loading', message: '' });
    // Test against whatever is currently saved, since the API key
    // must be persisted before recipeApi can read it.
    setSettings({ ...settings, apiKey: apiKey.trim() });
    try {
      await recipeApi.listRecipes({ per_page: 1 });
      setTestState({ status: 'success', message: 'Connected! Your API key works.' });
    } catch (err) {
      setTestState({
        status: 'error',
        message: err instanceof ApiError ? err.message : 'Could not connect.',
      });
    }
  };

  const handleClear = () => {
    setApiKey('');
    setSettings({ ...settings, apiKey: '' });
    setTestState({ status: 'idle', message: '' });
  };

  return (
    <div>
      <h1 className="page-title">Settings</h1>
      <form className="settings-form" onSubmit={handleSave}>
        <div className="field">
          <label htmlFor="apiKey">Recipe API key</label>
          <input
            id="apiKey"
            type={showKey ? 'text' : 'password'}
            placeholder="sk_live_..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            autoComplete="off"
          />
          <label className="checkbox-row">
            <input type="checkbox" checked={showKey} onChange={(e) => setShowKey(e.target.checked)} />
            Show key
          </label>
        </div>

        <div className="toolbar">
          <button type="submit" className="btn btn-accent">
            {saved ? 'Saved ✓' : 'Save key'}
          </button>
          <button type="button" className="btn" onClick={handleTest} disabled={!apiKey}>
            {testState.status === 'loading' ? 'Testing…' : 'Test connection'}
          </button>
          <button type="button" className="btn btn-danger" onClick={handleClear} disabled={!apiKey}>
            Clear key
          </button>
        </div>

        {testState.status === 'success' && <div className="hint-banner">{testState.message}</div>}
        {testState.status === 'error' && <div className="error-banner">{testState.message}</div>}
      </form>

      <p className="recipe-desc" style={{ marginTop: '1.5rem', maxWidth: 480 }}>
        Get a free API key at{' '}
        <a href="https://recipeapi.io/register" target="_blank" rel="noreferrer">
          recipeapi.io
        </a>
        . Your key is stored only in this browser's local storage — it is never sent anywhere
        besides Recipe API itself.
      </p>
    </div>
  );
}
