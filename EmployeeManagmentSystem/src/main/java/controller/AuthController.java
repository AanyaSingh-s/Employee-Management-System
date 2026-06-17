package controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service.AuthService;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> body) {
        try {
            String username = body.get("username");
            String password = body.get("password");

            if (username == null || username.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Username is required."));
            }
            if (password == null || password.length() < 6) {
                return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 6 characters."));
            }

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(authService.signup(username, password));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            String username = body.get("username");
            String password = body.get("password");

            if (username == null || username.isBlank() || password == null || password.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Username and password are required."));
            }

            return ResponseEntity.ok(authService.login(username, password));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        }
    }
}
