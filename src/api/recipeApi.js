const BASE_URL = 'https://recipeapi.io/api/v1';
const SETTINGS_KEY = 'recipeApiSettings';

export function getApiKey() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return '';
    const parsed = JSON.parse(raw);
    return parsed?.apiKey || '';
  } catch {
    return '';
  }
}

export function hasApiKey() {
  return Boolean(getApiKey());
}

class ApiError extends Error {
  constructor(message, code, status) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

async function request(path, params = {}) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new ApiError(
      'No Recipe API key configured. Add your key on the Settings page.',
      'NO_API_KEY'
    );
  }

  const url = new URL(BASE_URL + path);
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value)) {
      if (value.length) url.searchParams.set(key, value.join(','));
    } else {
      url.searchParams.set(key, String(value));
    }
  });

  let res;
  try {
    res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
  } catch (networkErr) {
    throw new ApiError(
      'Could not reach Recipe API. Check your internet connection.',
      'NETWORK_ERROR'
    );
  }

  let body = null;
  try {
    body = await res.json();
  } catch {
    // no JSON body
  }

  if (!res.ok) {
    const message = body?.error?.message || `Request failed with status ${res.status}`;
    throw new ApiError(message, body?.error?.code || 'UNKNOWN_ERROR', res.status);
  }

  return body;
}

export const recipeApi = {
  listRecipes(params) {
    return request('/recipes', params);
  },
  getRecipe(id) {
    return request(`/recipes/${id}`);
  },
  randomRecipe(params) {
    return request('/recipes/random', params);
  },
  listIngredients(params) {
    return request('/ingredients', params);
  },
};

export { ApiError };
