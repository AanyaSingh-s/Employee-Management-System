import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/employees';

class EmployeeService {

  getAllEmployees() {
    return axios.get(BASE_URL);
  }

  getEmployeeById(id) {
    return axios.get(`${BASE_URL}/${id}`);
  }

  createEmployee(employee) {
    return axios.post(BASE_URL, employee);
  }

  updateEmployee(id, employee) {
    return axios.put(`${BASE_URL}/${id}`, employee);
  }

  deleteEmployee(id) {
    return axios.delete(`${BASE_URL}/${id}`);
  }

  searchEmployees(keyword) {
    return axios.get(`${BASE_URL}/search?keyword=${encodeURIComponent(keyword)}`);
  }
}

export default new EmployeeService();
