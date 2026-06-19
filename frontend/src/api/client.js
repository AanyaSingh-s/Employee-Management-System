const API_BASE = import.meta.env.VITE_API_URL ?? '';

async function request(path, options = {}) {
  const { skipAuth = false, ...fetchOptions } = options;
  const token = skipAuth ? null : localStorage.getItem('ems_token');

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...fetchOptions.headers,
      },
    });
  } catch {
    throw new Error(
      'Unable to reach the server. Make sure the backend is running on port 2027.'
    );
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const serverMessage = data?.error || data?.message;
    if (serverMessage) {
      throw new Error(serverMessage);
    }
    if (response.status === 401) {
      throw new Error('Session expired or unauthorized. Please sign in again.');
    }
    if (response.status === 403) {
      throw new Error('Access denied. Use the admin login for this page.');
    }
    throw new Error(`Request failed (${response.status})`);
  }

  return data;
}

export const api = {
  get: (path, options) => request(path, options),
  post: (path, body, options) =>
    request(path, { method: 'POST', body: JSON.stringify(body ?? {}), ...options }),
  put: (path, body, options) =>
    request(path, { method: 'PUT', body: JSON.stringify(body), ...options }),
  patch: (path, body, options) =>
    request(path, { method: 'PATCH', body: JSON.stringify(body ?? {}), ...options }),
  delete: (path, options) => request(path, { method: 'DELETE', ...options }),
};
