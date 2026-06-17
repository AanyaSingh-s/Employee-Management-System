import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/auth';
const USER_KEY = 'ems_user';

class AuthService {

  signup(username, password) {
    return axios.post(`${BASE_URL}/signup`, { username, password });
  }

  login(username, password) {
    return axios.post(`${BASE_URL}/login`, { username, password });
  }

  saveUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getCurrentUser() {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  isAuthenticated() {
    return this.getCurrentUser() !== null;
  }

  logout() {
    localStorage.removeItem(USER_KEY);
  }
}

export default new AuthService();
