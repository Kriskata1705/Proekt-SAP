package com.example.documentsystem.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class Version {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int versionNumber;

    private String content;

    private String comment;

    private boolean active;

    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    private VersionStatus status;

    @ManyToOne
    private Document document;
    
    @ManyToOne
    private User creator;
    public Version(String content, User creator) {
        this.content = content;
        this.creator = creator;
        this.status = VersionStatus.IN_REVIEW;
        this.createdAt = LocalDateTime.now();
    }

    public void setStatus(VersionStatus status) {
        this.status = status;
    }

    public VersionStatus getStatus() {
        return status;
    }
     public void setContent(String content) {
        this.content = content;
    }

    public String getContent() {
        return content;
    }
    public User getCreator() {
        return creator;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreator(User creator) {
        this.creator = creator;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public void setDocument(Document document) {
        this.document = document;
    }
    public Document getDocument() {
        return document;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
     public int getVersionNumber() {
        return versionNumber;
    }
    public void setVersionNumber(int versionNumber) {
        this.versionNumber = versionNumber;
    }
    public boolean isActive() {
        return active;
    }
    public void setActive(boolean active) {
        this.active = active;
    }
    public String getComment() {
        return comment;
    }
    public void setComment(String comment) {
        this.comment = comment;
    }
}