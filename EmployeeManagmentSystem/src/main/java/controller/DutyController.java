package controller;

import model.Duty;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import repository.DutyRepository;

import java.util.List;

@RestController
@RequestMapping("/api/duties")
@CrossOrigin(origins = "http://localhost:3000")
public class DutyController {

    private final DutyRepository dutyRepository;

    public DutyController(DutyRepository dutyRepository) {
        this.dutyRepository = dutyRepository;
    }

    @GetMapping
    public List<Duty> getAll() {
        return dutyRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Duty> getById(@PathVariable Integer id) {
        return dutyRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Duty> create(@RequestBody Duty duty) {
        return ResponseEntity.status(HttpStatus.CREATED).body(dutyRepository.save(duty));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Duty> update(@PathVariable Integer id, @RequestBody Duty duty) {
        if (!dutyRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        duty.setId(id);
        return ResponseEntity.ok(dutyRepository.save(duty));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (!dutyRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        dutyRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/employee/{employeeId}")
    public List<Duty> getByEmployee(@PathVariable Long employeeId) {
        return dutyRepository.findByEmployeeId(employeeId);
    }

    @GetMapping("/manager/{managerId}")
    public List<Duty> getByManager(@PathVariable Long managerId) {
        return dutyRepository.findByAssignedByManagerId(managerId);
    }
}
