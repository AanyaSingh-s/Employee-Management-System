package com.example.ems.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private Long id;
    private String username;
    private String message;
}
