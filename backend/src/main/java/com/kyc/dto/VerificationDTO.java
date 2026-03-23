package com.kyc.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VerificationDTO {
    @NotBlank(message = "Status is required (APPROVED or REJECTED)")
    private String status;
    
    private String remarks; // Required if REJECTED
}
