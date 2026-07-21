const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';


let authToken = localStorage.getItem('staffopt_token') || null;

export function setAuthToken(token) {
  authToken = token;
  if (token) {
    localStorage.setItem('staffopt_token', token);
  } else {
    localStorage.removeItem('staffopt_token');
  }
}

export function getAuthToken() {
  return authToken;
}

function getAuthHeaders(extraHeaders = {}) {
  const headers = { 'Content-Type': 'application/json', ...extraHeaders };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
}

export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Authentication failed' }));
    throw new Error(errorData.detail || 'Login failed');
  }
  const data = await res.json();
  setAuthToken(data.access_token);
  return data;
}

export async function fetchCurrentUser() {
  if (!authToken) return null;
  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      setAuthToken(null);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error('Error fetching current user:', err);
    return null;
  }
}

export async function fetchHealthStatus() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error('API server unavailable');
    return await res.json();
  } catch (err) {
    return { status: 'offline', version: '2.0.0', error: err.message };
  }
}

export async function fetchLatestForecast() {
  try {
    const res = await fetch(`${API_BASE_URL}/forecast/latest`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch forecast data');
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function fetchEvaluationData(horizon = '24h') {
  try {
    const res = await fetch(`${API_BASE_URL}/forecast/evaluation?horizon=${horizon}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch evaluation data');
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function triggerPipelineRetrain() {
  const res = await fetch(`${API_BASE_URL}/forecast/train`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({ detail: 'Retrain failed' }));
    throw new Error(errData.detail || 'Retrain pipeline failed');
  }
  return await res.json();
}
