package com.example.documentsystem.service;

import com.example.documentsystem.dto.VersionRequest;
import com.example.documentsystem.model.Document;
import com.example.documentsystem.model.User;
import com.example.documentsystem.model.Version;
import com.example.documentsystem.model.VersionStatus;
import com.example.documentsystem.repository.DocumentRepository;
import com.example.documentsystem.repository.VersionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class VersionService {

    private final VersionRepository versionRepository;
    private final DocumentRepository documentRepository;

    public VersionService(VersionRepository versionRepository,
                          DocumentRepository documentRepository) {
        this.versionRepository = versionRepository;
        this.documentRepository = documentRepository;
    }

    // Създаване на нова версия
    public Version createVersion(Long documentId, VersionRequest request, User user) {

        Document document = documentRepository.findById(documentId)
            .orElseThrow(() -> new RuntimeException("Document not found"));

        Version version = new Version(null, user);

        version.setDocument(document);
        version.setContent(request.getContent());
        version.setCreator(user);
        version.setCreatedAt(LocalDateTime.now());
        version.setStatus(VersionStatus.IN_REVIEW);

        return versionRepository.save(version);
    }

    // Одобряване на версия
    public void approveVersion(Long versionId) {

        Version version = versionRepository.findById(versionId)
                .orElseThrow(() -> new RuntimeException("Version not found"));

        if (version.getStatus() == VersionStatus.REJECTED) {
            throw new RuntimeException("Rejected version cannot be approved");
        }

        version.setStatus(VersionStatus.APPROVED);

        versionRepository.save(version);
    }

    // Отхвърляне
    public void rejectVersion(Long versionId, String comment) {

        Version version = versionRepository.findById(versionId)
                .orElseThrow(() -> new RuntimeException("Version not found"));

        version.setStatus(VersionStatus.REJECTED);
        version.setComment(comment);

        versionRepository.save(version);
    }

    // Активиране на версия
    public void activateVersion(Long versionId) {

        Version version = versionRepository.findById(versionId)
                .orElseThrow(() -> new RuntimeException("Version not found"));

        if (version.getStatus() != VersionStatus.APPROVED) {
            throw new RuntimeException("Only APPROVED versions can be activated");
        }

        Version currentActive = versionRepository
                .findTopByDocumentIdAndActiveTrue(version.getDocument().getId());

        if (currentActive != null) {
            currentActive.setActive(false);
            versionRepository.save(currentActive);
        }

        version.setActive(true);

        versionRepository.save(version);
    }

    // История на версии
    public List<Version> getVersionHistory(Long documentId) {

        return versionRepository.findByDocumentIdOrderByVersionNumber(documentId);

    }

}
