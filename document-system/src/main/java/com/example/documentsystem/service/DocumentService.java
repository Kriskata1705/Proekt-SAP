package com.example.documentsystem.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.documentsystem.dto.DocumentRequest;
import com.example.documentsystem.model.Document;
import com.example.documentsystem.model.Version;
import com.example.documentsystem.repository.DocumentRepository;
import com.example.documentsystem.repository.VersionRepository;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final VersionRepository versionRepository;

    public DocumentService(DocumentRepository documentRepository,
                           VersionRepository versionRepository) {
        this.documentRepository = documentRepository;
        this.versionRepository = versionRepository;
    }

    public Document createDocument(DocumentRequest request) {

        Document document = new Document();
        document.setTitle(request.getTitle());
        document.setDescription(request.getDescription());

        return documentRepository.save(document);
    }

    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    public List<Version> getHistory(Long documentId) {
        return versionRepository.findByDocumentId(documentId);
    }
}
