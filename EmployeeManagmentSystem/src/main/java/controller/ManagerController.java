package controller;

import model.Manager;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import repository.ManagerRepository;

import java.util.List;

@RestController
@RequestMapping("/api/managers")
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
    public Manager create(@RequestBody Manager manager) {
        return managerRepository.save(manager);
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
}
