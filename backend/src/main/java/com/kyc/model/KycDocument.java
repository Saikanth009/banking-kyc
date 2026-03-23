package com.kyc.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "kyc_documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KycDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private User customer;
    
    private String documentType;   // AADHAAR, PAN, PASSPORT, DRIVING_LICENSE
    
    private String filePath;
    
    @Enumerated(EnumType.STRING)
    private VerificationStatus status; // PENDING, APPROVED, REJECTED
    
    @Column(columnDefinition = "TEXT")
    private String remarks;
    
    private LocalDateTime submittedAt;
    
    private LocalDateTime reviewedAt;
    
    @ManyToOne
    @JoinColumn(name = "reviewed_by_id")
    private User reviewedBy;
    
    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
    }
}
