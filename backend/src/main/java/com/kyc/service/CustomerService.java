package com.kyc.service;

import com.kyc.exception.ResourceNotFoundException;
import com.kyc.model.KycDocument;
import com.kyc.model.User;
import com.kyc.model.VerificationStatus;
import com.kyc.repository.KycDocumentRepository;
import com.kyc.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final KycDocumentRepository kycDocumentRepository;
    private final UserRepository userRepository;

    // Save to local filesystem for simplicity, consider S3 for production
    private final String UPLOAD_DIR = "uploads/";

    public KycDocument submitKyc(String email, String documentType, MultipartFile file) throws IOException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        KycDocument document = new KycDocument();
        document.setCustomer(user);
        document.setDocumentType(documentType);
        document.setFilePath("/" + UPLOAD_DIR + fileName);
        document.setStatus(VerificationStatus.PENDING);
        
        return kycDocumentRepository.save(document);
    }

    public List<KycDocument> getMyDocuments(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                
        return kycDocumentRepository.findByCustomer(user);
    }
    
    public void deleteDocument(Long id, String email) {
        KycDocument document = kycDocumentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
                
        if (!document.getCustomer().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized to delete this document");
        }
        
        kycDocumentRepository.delete(document);
    }
}
