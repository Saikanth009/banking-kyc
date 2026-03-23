package com.kyc.repository;

import com.kyc.model.KycDocument;
import com.kyc.model.User;
import com.kyc.model.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface KycDocumentRepository extends JpaRepository<KycDocument, Long> {
    List<KycDocument> findByCustomer(User customer);
    List<KycDocument> findByStatus(VerificationStatus status);
    long countByStatus(VerificationStatus status);
}
