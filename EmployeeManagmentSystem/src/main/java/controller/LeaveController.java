package controller;

import model.Leave;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import repository.LeaveRepository;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
public class LeaveController {

    private final LeaveRepository leaveRepository;

    public LeaveController(LeaveRepository leaveRepository) {
        this.leaveRepository = leaveRepository;
    }

    @GetMapping
    public List<Leave> getAll() {
        return leaveRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Leave> getById(@PathVariable Integer id) {
        return leaveRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Leave create(@RequestBody Leave leave) {
        return leaveRepository.save(leave);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Leave> update(@PathVariable Integer id, @RequestBody Leave leave) {
        if (!leaveRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        leave.setId(id);
        return ResponseEntity.ok(leaveRepository.save(leave));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (!leaveRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        leaveRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
