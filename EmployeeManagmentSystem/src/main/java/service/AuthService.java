package service;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import model.User;
import model.UserRole;
import repository.UserRepository;

@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final security.JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, security.JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public Map<String, Object> signup(String username, String password) {
        return createAccount(username, password, UserRole.USER, "Account created successfully.");
    }

    public Map<String, Object> adminSignup(String username, String password) {
        return createAccount(username, password, UserRole.ADMIN, "Admin account created successfully.");
    }

    private Map<String, Object> createAccount(String username, String password, UserRole role, String message) {
        String normalizedUsername = username.trim();

        if (userRepository.existsByUsername(normalizedUsername)) {
            throw new IllegalArgumentException("Username is already taken.");
        }

        User user = new User();
        user.setUsername(normalizedUsername);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);

        User saved = userRepository.save(user);
        return toResponse(saved, message);
    }

    public Map<String, Object> login(String username, String password) {
        return authenticate(username, password, UserRole.USER, "Login successful.");
    }

    public Map<String, Object> adminLogin(String username, String password) {
        return authenticate(username, password, UserRole.ADMIN, "Admin login successful.");
    }

    private Map<String, Object> authenticate(String username, String password, UserRole expectedRole, String message) {
        User user = userRepository.findByUsername(username.trim())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password."));

        UserRole actualRole = user.getRole() != null ? user.getRole() : UserRole.USER;

        if (actualRole != expectedRole) {
            throw new IllegalArgumentException(
                    expectedRole == UserRole.ADMIN
                            ? "This account is not an admin. Use the regular login."
                            : "Admin accounts must use the admin login."
            );
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password.");
        }

        String token = jwtService.generateToken(
                user.getUsername(),
                user.getId(),
                actualRole.name()
        );

        user.setLastLoginTime(jwtService.getLoginTime(token));
        userRepository.save(user);

        Map<String, Object> response = toResponse(user, message);
        response.put("token", token);
        response.put("lastLoginTime", user.getLastLoginTime());
        return response;
    }

    public Map<String, Object> logout(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        user.setLastLogoutTime(java.time.LocalDateTime.now());
        userRepository.save(user);

        Map<String, Object> response = toResponse(user, "Logout successful.");
        response.put("lastLogoutTime", user.getLastLogoutTime());
        return response;
    }

    private Map<String, Object> toResponse(User user, String message) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("role", user.getRole() != null ? user.getRole().name() : UserRole.USER.name());
        response.put("message", message);
        return response;
    }
}
