package com.example.ems.service;

import com.example.ems.entity.Employee;
import com.example.ems.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    // ── CREATE ──────────────────────────────────────────────────────────────

    public Employee createEmployee(Employee employee) {
        if (employeeRepository.existsByEmail(employee.getEmail())) {
            throw new IllegalArgumentException(
                "An employee with email '" + employee.getEmail() + "' already exists."
            );
        }
        return employeeRepository.save(employee);
    }

    // ── READ ─────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
    }

    // ── UPDATE ───────────────────────────────────────────────────────────────

    public Employee updateEmployee(Long id, Employee updatedData) {
        Employee existing = getEmployeeById(id);

        // If email is changing, ensure the new one is not already taken
        if (!existing.getEmail().equalsIgnoreCase(updatedData.getEmail())
                && employeeRepository.existsByEmail(updatedData.getEmail())) {
            throw new IllegalArgumentException(
                "Email '" + updatedData.getEmail() + "' is already in use."
            );
        }

        existing.setFirstName(updatedData.getFirstName());
        existing.setLastName(updatedData.getLastName());
        existing.setEmail(updatedData.getEmail());
        existing.setPhone(updatedData.getPhone());
        existing.setDepartment(updatedData.getDepartment());
        existing.setRole(updatedData.getRole());
        existing.setStatus(updatedData.getStatus());
        existing.setJoinDate(updatedData.getJoinDate());
        existing.setSalary(updatedData.getSalary());

        return employeeRepository.save(existing);
    }

    // ── DELETE ───────────────────────────────────────────────────────────────

    public void deleteEmployee(Long id) {
        Employee employee = getEmployeeById(id); // ensures 404 if not found
        employeeRepository.delete(employee);
    }

    // ── SEARCH ───────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<Employee> searchEmployees(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return getAllEmployees();
        }
        return employeeRepository.searchByKeyword(keyword.trim());
    }

    // ── FILTER ───────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<Employee> getByDepartment(String department) {
        return employeeRepository.findByDepartment(department);
    }

    @Transactional(readOnly = true)
    public List<Employee> getByStatus(String status) {
        return employeeRepository.findByStatus(status);
    }
}
