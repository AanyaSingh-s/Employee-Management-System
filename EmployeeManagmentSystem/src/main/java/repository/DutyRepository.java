package repository;

import model.Duty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DutyRepository extends JpaRepository<Duty, Integer> {

    List<Duty> findByEmployeeId(Long employeeId);

    List<Duty> findByAssignedByManagerId(Long managerId);
}
