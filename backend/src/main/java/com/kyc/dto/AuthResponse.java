package com.kyc.dto;

import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private Long id;
    private String fullName;
    private String email;
    private String role;
}
