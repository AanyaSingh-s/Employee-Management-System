package model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(name = "last_login_time")
    private java.time.LocalDateTime lastLoginTime;

    @Column(name = "last_logout_time")
    private java.time.LocalDateTime lastLogoutTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserRole role = UserRole.USER;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public java.time.LocalDateTime getLastLoginTime() {
        return lastLoginTime;
    }

    public void setLastLoginTime(java.time.LocalDateTime lastLoginTime) {
        this.lastLoginTime = lastLoginTime;
    }

    public java.time.LocalDateTime getLastLogoutTime() {
        return lastLogoutTime;
    }

    public void setLastLogoutTime(java.time.LocalDateTime lastLogoutTime) {
        this.lastLogoutTime = lastLogoutTime;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }
}