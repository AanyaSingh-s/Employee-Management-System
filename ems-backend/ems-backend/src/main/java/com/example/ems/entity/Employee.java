package com.example.ems.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "employees")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name must not exceed 50 characters")
    @Column(nullable = false, length = 50)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 50)
    @Column(nullable = false, length = 50)
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @NotBlank(message = "Phone is required")
    @Column(nullable = false, length = 20)
    private String phone;

    @NotBlank(message = "Department is required")
    @Column(nullable = false, length = 50)
    private String department;

    @NotBlank(message = "Role is required")
    @Column(nullable = false, length = 50)
    private String role;

    @Column(length = 20)
    private String status = "Active";

    @Column(name = "join_date")
    private String joinDate;

    @Positive(message = "Salary must be a positive number")
    private Double salary;
}
