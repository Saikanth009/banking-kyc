package com.kyc.controller;

import com.kyc.model.KycDocument;
import com.kyc.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/customer")
@PreAuthorize("hasRole('CUSTOMER')")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping("/submit-kyc")
    public ResponseEntity<KycDocument> submitKyc(
            @RequestParam("documentType") String documentType,
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) throws IOException {
        String email = authentication.getName();
        return ResponseEntity.ok(customerService.submitKyc(email, documentType, file));
    }

    @GetMapping("/documents")
    public ResponseEntity<List<KycDocument>> getMyDocuments(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(customerService.getMyDocuments(email));
    }

    @GetMapping("/status")
    public ResponseEntity<List<KycDocument>> getMyStatus(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(customerService.getMyDocuments(email));
    }
    
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        customerService.deleteDocument(id, email);
        return ResponseEntity.ok().build();
    }
}
