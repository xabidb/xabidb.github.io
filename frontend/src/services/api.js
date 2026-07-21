const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:8000/api/v1' : '/api/v1');

let authToken = localStorage.getItem('staffopt_token') || null;

export function setAuthToken(token) {
  authToken = token;
  if (token) {
    localStorage.setItem('staffopt_token', token);
  } else {
    localStorage.removeItem('staffopt_token');
    localStorage.removeItem('staffopt_demo_user');
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
  // 1. Try real FastAPI backend authentication if available
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const data = await res.json();
      setAuthToken(data.access_token);
      return data;
    }
  } catch (err) {
    console.warn('Backend API server unreachable, falling back to client-side demo authentication.');
  }

  // 2. Client-side static demo authentication fallback (for GitHub Pages / offline hosting)
  const cleanEmail = (email || '').toLowerCase().trim();
  const demoAccounts = {
    'admin@explorium.io': { password: 'adminpassword', role: 'admin', full_name: 'System Administrator' },
    'manager@explorium.io': { password: 'managerpassword', role: 'manager', full_name: 'Store Manager' },
    'viewer@explorium.io': { password: 'viewerpassword', role: 'viewer', full_name: 'Guest Viewer' },
  };

  const account = demoAccounts[cleanEmail];
  if (account && account.password === password) {
    const demoToken = `demo_token_${account.role}_${Date.now()}`;
    const userPayload = {
      id: 1,
      email: cleanEmail,
      full_name: account.full_name,
      role: account.role,
      is_active: true,
      created_at: new Date().toISOString(),
    };
    setAuthToken(demoToken);
    localStorage.setItem('staffopt_demo_user', JSON.stringify(userPayload));
    return { access_token: demoToken, token_type: 'bearer', user: userPayload };
  }

  throw new Error('Incorrect email or password. Demo accounts: admin@explorium.io, manager@explorium.io, or viewer@explorium.io.');
}

export async function fetchCurrentUser() {
  if (!authToken) return null;
  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Backend offline fallback
  }

  const savedDemo = localStorage.getItem('staffopt_demo_user');
  if (savedDemo) {
    try {
      return JSON.parse(savedDemo);
    } catch (e) {}
  }
  return null;
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
