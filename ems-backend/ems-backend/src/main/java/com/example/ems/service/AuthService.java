package com.example.ems.service;

import com.example.ems.dto.AuthResponse;
import com.example.ems.dto.LoginRequest;
import com.example.ems.dto.SignupRequest;
import com.example.ems.entity.User;
import com.example.ems.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse signup(SignupRequest request) {
        String username = request.getUsername().trim();

        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username is already taken.");
        }

        User user = User.builder()
            .username(username)
            .password(passwordEncoder.encode(request.getPassword()))
            .build();

        User saved = userRepository.save(user);

        return AuthResponse.builder()
            .id(saved.getId())
            .username(saved.getUsername())
            .message("Account created successfully.")
            .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername().trim())
            .orElseThrow(() -> new IllegalArgumentException("Invalid username or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password.");
        }

        return AuthResponse.builder()
            .id(user.getId())
            .username(user.getUsername())
            .message("Login successful.")
            .build();
    }
}
