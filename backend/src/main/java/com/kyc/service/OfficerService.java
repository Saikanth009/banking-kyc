package com.kyc.service;

import com.kyc.dto.VerificationDTO;
import com.kyc.exception.ResourceNotFoundException;
import com.kyc.model.AuditLog;
import com.kyc.model.KycDocument;
import com.kyc.model.User;
import com.kyc.model.VerificationStatus;
import com.kyc.repository.AuditLogRepository;
import com.kyc.repository.KycDocumentRepository;
import com.kyc.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OfficerService {

    private final KycDocumentRepository kycDocumentRepository;
    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;

    public List<KycDocument> getAllPending() {
        return kycDocumentRepository.findByStatus(VerificationStatus.PENDING);
    }
    
    public List<KycDocument> getAllSubmissions() {
        return kycDocumentRepository.findAll();
    }

    public KycDocument verifyDocument(Long id, VerificationDTO dto, String officerEmail) {
        KycDocument document = kycDocumentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
                
        User officer = userRepository.findByEmail(officerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Officer not found"));

        VerificationStatus status = VerificationStatus.valueOf(dto.getStatus().toUpperCase());
        document.setStatus(status);
        document.setReviewedBy(officer);
        document.setReviewedAt(LocalDateTime.now());
        
        if (status == VerificationStatus.REJECTED) {
            document.setRemarks(dto.getRemarks());
        } else {
            document.setRemarks("Verified and Approved");
        }
        
        KycDocument savedDoc = kycDocumentRepository.save(document);
        
        // Save Audit Log
        AuditLog log = new AuditLog();
        log.setUser(officer);
        log.setAction(status.name() + "_KYC");
        log.setDetails("Officer " + officer.getFullName() + " " + status.name().toLowerCase() + " document ID: " + document.getId());
        auditLogRepository.save(log);
        
        return savedDoc;
    }

    public Map<String, Long> getDashboardStats() {
        long pending = kycDocumentRepository.countByStatus(VerificationStatus.PENDING);
        long approved = kycDocumentRepository.countByStatus(VerificationStatus.APPROVED);
        long rejected = kycDocumentRepository.countByStatus(VerificationStatus.REJECTED);
        long total = kycDocumentRepository.count();
        
        Map<String, Long> stats = new HashMap<>();
        stats.put("pending", pending);
        stats.put("approved", approved);
        stats.put("rejected", rejected);
        stats.put("total", total);
        
        return stats;
    }
}
