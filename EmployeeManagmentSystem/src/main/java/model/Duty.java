package model;

import jakarta.persistence.*;
//
//import static com.sun.tools.classfile.Module_attribute.RequiresEntry.length;

@Entity
@Table(name = "duty_table")
public class Duty {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(nullable = false)
    private String title;
    @Column(nullable = false , length = 3000 )
    private String description;

    @ManyToOne
    @JoinColumn(name = "emp_id")
    private Employee employee;

    @ManyToOne
    @JoinColumn(name = "assignedByManager")
    private Manager assignedByManager;

    @ManyToOne
    @JoinColumn(name = "assignedByAdmin")
    private Admin assignedByAdmin;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Manager getAssignedByManager() {
        return assignedByManager;
    }

    public void setAssignedByManager(Manager assignedByManager) {
        this.assignedByManager = assignedByManager;
    }

    public Admin getAssignedByAdmin() {
        return assignedByAdmin;
    }

    public void setAssignedByAdmin(Admin assignedByAdmin) {
        this.assignedByAdmin = assignedByAdmin;
    }

    @Override
    public String toString() {
        return "Duty{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", employee=" + employee +
                ", assignedByManager=" + assignedByManager +
                ", assignedByAdmin=" + assignedByAdmin +
                '}';
    }
}
