package service;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import model.User;
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

        String normalizedUsername = username.trim();

        if (userRepository.existsByUsername(normalizedUsername)) {
            throw new IllegalArgumentException("Username is already taken.");
        }

        User user = new User();
        user.setUsername(normalizedUsername);
        user.setPassword(passwordEncoder.encode(password));

        User saved = userRepository.save(user);
        return toResponse(saved, "Account created successfully.");
    }

    public Map<String, Object> login(String username, String password) {


        User user = userRepository.findByUsername(username.trim())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password."));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password.");
        }

        String token = jwtService.generateToken(user.getUsername(), user.getId());

        user.setLastLoginTime(jwtService.getLoginTime(token));
        userRepository.save(user);

        Map<String, Object> response = toResponse(user, "Login successful.");
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
        response.put("message", message);
        return response;
    }
}