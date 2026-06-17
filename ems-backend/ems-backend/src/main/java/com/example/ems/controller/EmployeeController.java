package com.example.ems.controller;

import com.example.ems.entity.Employee;
import com.example.ems.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:3000")   // React dev server
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    // ── GET all employees ───────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    // ── GET employee by ID ──────────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    // ── POST create employee ────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<?> createEmployee(@Valid @RequestBody Employee employee) {
        try {
            Employee created = employeeService.createEmployee(employee);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", e.getMessage()));
        }
    }

    // ── PUT update employee ─────────────────────────────────────────────────
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody Employee employee) {
        try {
            Employee updated = employeeService.updateEmployee(id, employee);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        }
    }

    // ── DELETE employee ─────────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
        try {
            employeeService.deleteEmployee(id);
            return ResponseEntity.ok(Map.of("message", "Employee deleted successfully."));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        }
    }

    // ── GET search employees ────────────────────────────────────────────────
    @GetMapping("/search")
    public ResponseEntity<List<Employee>> searchEmployees(
            @RequestParam(defaultValue = "") String keyword) {
        return ResponseEntity.ok(employeeService.searchEmployees(keyword));
    }

    // ── GET by department ───────────────────────────────────────────────────
    @GetMapping("/department/{department}")
    public ResponseEntity<List<Employee>> getByDepartment(
            @PathVariable String department) {
        return ResponseEntity.ok(employeeService.getByDepartment(department));
    }

    // ── GET by status ───────────────────────────────────────────────────────
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Employee>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(employeeService.getByStatus(status));
    }
}
