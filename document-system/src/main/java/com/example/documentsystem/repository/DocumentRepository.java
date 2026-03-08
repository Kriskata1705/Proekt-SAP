package com.example.documentsystem.repository;
import com.example.documentsystem.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentRepository extends JpaRepository<Document, Long>{
    
}
