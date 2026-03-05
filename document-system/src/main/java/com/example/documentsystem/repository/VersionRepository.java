package com.example.documentsystem.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.documentsystem.model.Version;

public interface VersionRepository extends JpaRepository<Version, Long> {

    List<Version> findByDocumentId(Long documentId);
    List<Version> findByDocumentIdOrderByVersionNumber(Long documentId);
    Version findTopByDocumentIdAndActiveTrue(Long documentId);
}
