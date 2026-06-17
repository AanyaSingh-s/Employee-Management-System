package controller;

import model.Employee;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import repository.EmployeeRepository;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:3000")
public class EmployeeController {

    private final EmployeeRepository employeeRepository;

    public EmployeeController(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @GetMapping
    public List<Employee> getAll() {
        return employeeRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getById(@PathVariable Long id) {
        return employeeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Employee employee) {
        if (employee.getId() != null && employeeRepository.existsById(employee.getId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Employee with this ID already exists."));
        }
        if (employeeRepository.existsByUsername(employee.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Username already taken."));
        }
        if (employeeRepository.existsByEmail(employee.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Email already registered."));
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(employeeRepository.save(employee));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Employee employee) {
        if (!employeeRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Employee not found with id: " + id));
        }
        if (employeeRepository.existsByUsernameAndIdNot(employee.getUsername(), id)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Username already taken."));
        }
        if (employeeRepository.existsByEmailAndIdNot(employee.getEmail(), id)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Email already registered."));
        }
        employee.setId(id);
        return ResponseEntity.ok(employeeRepository.save(employee));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!employeeRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Employee not found with id: " + id));
        }
        employeeRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Employee deleted successfully."));
    }

    @GetMapping("/search")
    public List<Employee> searchEmployees(@RequestParam(defaultValue = "") String keyword) {
        if (keyword.isBlank()) {
            return employeeRepository.findAll();
        }
        return employeeRepository.searchByKeyword(keyword);
    }

    @GetMapping("/department/{department}")
    public List<Employee> getByDepartment(@PathVariable String department) {
        return employeeRepository.findByDepartment(department);
    }

    @GetMapping("/manager/{managerId}")
    public List<Employee> getByManager(@PathVariable Long managerId) {
        return employeeRepository.findByManagerId(managerId);
    }
}
