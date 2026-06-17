const USER_KEY = 'ems_user';

export function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser() {
  const stored = localStorage.getItem(USER_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function isAuthenticated() {
  return getUser() !== null;
}

export function logout() {
  localStorage.removeItem(USER_KEY);
}
