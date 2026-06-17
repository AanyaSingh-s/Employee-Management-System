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

export function logout() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

