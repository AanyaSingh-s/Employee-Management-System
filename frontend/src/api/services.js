import { api } from './client';

export const authApi = {
  signup: (username, password) =>
    api.post('/api/auth/signup', { username, password }),
  login: (username, password) =>
    api.post('/api/auth/login', { username, password }),
};

export const homeApi = {
  getInfo: () => api.get('/'),
};

export const employeeApi = {
  getAll: () => api.get('/api/employees'),
  getById: (id) => api.get(`/api/employees/${id}`),
  search: (keyword) => api.get(`/api/employees/search?keyword=${encodeURIComponent(keyword)}`),
  getByDepartment: (department) => api.get(`/api/employees/department/${encodeURIComponent(department)}`),
  getByManager: (managerId) => api.get(`/api/employees/manager/${managerId}`),
  create: (data) => api.post('/api/employees', data),
  update: (id, data) => api.put(`/api/employees/${id}`, data),
  delete: (id) => api.delete(`/api/employees/${id}`),
};

export const managerApi = {
  getAll: () => api.get('/api/managers'),
  getById: (id) => api.get(`/api/managers/${id}`),
  getByDepartment: (department) => api.get(`/api/managers/department/${encodeURIComponent(department)}`),
  create: (data) => api.post('/api/managers', data),
  update: (id, data) => api.put(`/api/managers/${id}`, data),
  delete: (id) => api.delete(`/api/managers/${id}`),
};

export const adminApi = {
  getAll: () => api.get('/api/admins'),
  getById: (id) => api.get(`/api/admins/${id}`),
  create: (data) => api.post('/api/admins', data),
  update: (id, data) => api.put(`/api/admins/${id}`, data),
  delete: (id) => api.delete(`/api/admins/${id}`),
};

export const leaveApi = {
  getAll: () => api.get('/api/leaves'),
  getById: (id) => api.get(`/api/leaves/${id}`),
  getByStatus: (status) => api.get(`/api/leaves/status/${encodeURIComponent(status)}`),
  getByEmployee: (employeeId) => api.get(`/api/leaves/employee/${employeeId}`),
  create: (data) => api.post('/api/leaves', data),
  update: (id, data) => api.put(`/api/leaves/${id}`, data),
  updateStatus: (id, status) => api.patch(`/api/leaves/${id}/status`, { status }),
  delete: (id) => api.delete(`/api/leaves/${id}`),
};

export const dutyApi = {
  getAll: () => api.get('/api/duties'),
  getById: (id) => api.get(`/api/duties/${id}`),
  getByEmployee: (employeeId) => api.get(`/api/duties/employee/${employeeId}`),
  getByManager: (managerId) => api.get(`/api/duties/manager/${managerId}`),
  create: (data) => api.post('/api/duties', data),
  update: (id, data) => api.put(`/api/duties/${id}`, data),
  delete: (id) => api.delete(`/api/duties/${id}`),
};
