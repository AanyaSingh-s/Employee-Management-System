const USER_KEY = 'ems_user';
const TOKEN_KEY = 'ems_token';

export function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getUser() {
  const stored = localStorage.getItem(USER_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return !!getToken();
}

export function isAdmin() {
  return getUser()?.role === 'ADMIN';
}

export function isRegularUser() {
  return isAuthenticated() && getUser()?.role !== 'ADMIN';
}

export async function logout() {
  const token = getToken();
  if (token) {
    try {
      const { authApi } = await import('../api/services');
      await authApi.logout();
    } catch {
      // Clear local session even if the server call fails
    }
  }
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
}
