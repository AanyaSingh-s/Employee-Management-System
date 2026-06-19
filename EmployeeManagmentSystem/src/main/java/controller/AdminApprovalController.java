package controller;

import model.Employee;
import model.Leave;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import repository.EmployeeRepository;
import repository.LeaveRepository;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/approvals")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminApprovalController {

    private final EmployeeRepository employeeRepository;
    private final LeaveRepository leaveRepository;

    public AdminApprovalController(EmployeeRepository employeeRepository, LeaveRepository leaveRepository) {
        this.employeeRepository = employeeRepository;
        this.leaveRepository = leaveRepository;
    }

    @GetMapping("/employees/pending")
    public List<Employee> getPendingEmployees() {
        return employeeRepository.findByApprovalStatus("PENDING");
    }

    @GetMapping("/leaves/pending")
    public List<Leave> getPendingLeaves() {
        return leaveRepository.findByStatus("PENDING");
    }

    @PatchMapping("/employees/{id}/approve")
    public ResponseEntity<?> approveEmployee(@PathVariable Long id) {
        return updateEmployeeStatus(id, "APPROVED");
    }

    @PatchMapping("/employees/{id}/reject")
    public ResponseEntity<?> rejectEmployee(@PathVariable Long id) {
        return updateEmployeeStatus(id, "REJECTED");
    }

    @PatchMapping("/leaves/{id}/approve")
    public ResponseEntity<?> approveLeave(@PathVariable Integer id) {
        return updateLeaveStatus(id, "APPROVED");
    }

    @PatchMapping("/leaves/{id}/reject")
    public ResponseEntity<?> rejectLeave(@PathVariable Integer id) {
        return updateLeaveStatus(id, "REJECTED");
    }

    private ResponseEntity<?> updateEmployeeStatus(Long id, String status) {
        return employeeRepository.findById(id)
                .<ResponseEntity<?>>map(employee -> {
                    employee.setApprovalStatus(status);
                    return ResponseEntity.ok(employeeRepository.save(employee));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Employee not found with id: " + id)));
    }

    private ResponseEntity<?> updateLeaveStatus(Integer id, String status) {
        return leaveRepository.findById(id)
                .<ResponseEntity<?>>map(leave -> {
                    leave.setStatus(status);
                    return ResponseEntity.ok(leaveRepository.save(leave));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Leave request not found with id: " + id)));
    }
}
