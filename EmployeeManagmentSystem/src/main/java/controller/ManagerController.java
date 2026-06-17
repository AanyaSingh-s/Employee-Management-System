package controller;

import model.Manager;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import repository.ManagerRepository;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/managers")
@CrossOrigin(origins = "http://localhost:3000")
public class ManagerController {

    private final ManagerRepository managerRepository;

    public ManagerController(ManagerRepository managerRepository) {
        this.managerRepository = managerRepository;
    }

    @GetMapping
    public List<Manager> getAll() {
        return managerRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Manager> getById(@PathVariable Long id) {
        return managerRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Manager> create(@RequestBody Manager manager) {
        return ResponseEntity.status(HttpStatus.CREATED).body(managerRepository.save(manager));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Manager> update(@PathVariable Long id, @RequestBody Manager manager) {
        if (!managerRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        manager.setId(id);
        return ResponseEntity.ok(managerRepository.save(manager));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!managerRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        managerRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/department/{department}")
    public List<Manager> getByDepartment(@PathVariable String department) {
        return managerRepository.findByDepartment(department);
    }
}
