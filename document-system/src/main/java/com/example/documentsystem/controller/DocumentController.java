package com.example.documentsystem.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.documentsystem.dto.DocumentRequest;
import com.example.documentsystem.model.Document;
import com.example.documentsystem.model.Version;
import com.example.documentsystem.service.DocumentService;

@RestController
@RequestMapping("/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    // AUTHOR създава документ
    @PreAuthorize("hasRole('AUTHOR')")
    @PostMapping
    public Document createDocument(@RequestBody DocumentRequest request) {
        return documentService.createDocument(request);
    }

    // Всички могат да видят списък
    @GetMapping
    public List<Document> getAllDocuments() {
        return documentService.getAllDocuments();
    }

    // История на версии
    @GetMapping("/{id}/history")
    public List<Version> getDocumentHistory(@PathVariable Long id) {
        return documentService.getHistory(id);
    }
}
