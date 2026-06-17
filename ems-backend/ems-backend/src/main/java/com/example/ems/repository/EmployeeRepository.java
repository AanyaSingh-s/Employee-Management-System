package com.example.ems.repository;

import com.example.ems.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Optional<Employee> findByEmail(String email);

    boolean existsByEmail(String email);

    List<Employee> findByDepartment(String department);

    List<Employee> findByStatus(String status);

    /**
     * Full-text search across firstName, lastName, email, department, and role.
     * Case-insensitive LIKE query.
     */
    @Query("""
        SELECT e FROM Employee e
        WHERE LOWER(e.firstName)  LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(e.lastName)   LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(e.email)      LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(e.department) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(e.role)       LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(e.phone)      LIKE LOWER(CONCAT('%', :keyword, '%'))
        """)
    List<Employee> searchByKeyword(@Param("keyword") String keyword);
}
