package com.kyc.controller;

import com.kyc.dto.VerificationDTO;
import com.kyc.model.KycDocument;
import com.kyc.service.OfficerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/officer")
@PreAuthorize("hasRole('OFFICER')")
@RequiredArgsConstructor
public class OfficerController {

    private final OfficerService officerService;

    @GetMapping("/pending")
    public ResponseEntity<List<KycDocument>> getPendingDocuments() {
        return ResponseEntity.ok(officerService.getAllPending());
    }

    @GetMapping("/all")
    public ResponseEntity<List<KycDocument>> getAllDocuments() {
        return ResponseEntity.ok(officerService.getAllSubmissions());
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<KycDocument> approveDocument(
            @PathVariable Long id, 
            Authentication authentication) {
        String officerEmail = authentication.getName();
        VerificationDTO dto = new VerificationDTO();
        dto.setStatus("APPROVED");
        return ResponseEntity.ok(officerService.verifyDocument(id, dto, officerEmail));
    }

    @PutMapping("/reject/{id}")
    public ResponseEntity<KycDocument> rejectDocument(
            @PathVariable Long id, 
            @Valid @RequestBody VerificationDTO dto,
            Authentication authentication) {
        String officerEmail = authentication.getName();
        dto.setStatus("REJECTED");
        return ResponseEntity.ok(officerService.verifyDocument(id, dto, officerEmail));
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getDashboardStats() {
        return ResponseEntity.ok(officerService.getDashboardStats());
    }
}
