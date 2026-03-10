package com.example.dmsserver.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class Version {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private int versionNumber;

    private String content;

    @Enumerated(EnumType.STRING)
    private VersionStatus status;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "document_id")
    private Document document;

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @ManyToOne
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    private LocalDateTime approvedAt;

    public Version() {}

    public Version(int versionNumber, String content) {
        this.id = UUID.randomUUID();
        this.versionNumber = versionNumber;
        this.content = content;
        this.status = VersionStatus.DRAFT;
        this.createdAt = LocalDateTime.now();
    }

    public Version(String content, Document document) {
        this.id = UUID.randomUUID();
        this.content = content;
        this.document = document;
        this.status = VersionStatus.DRAFT;
        this.createdAt = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public int getVersionNumber() { return versionNumber; }
    public String getContent() { return content; }
    public VersionStatus getStatus() { return status; }
    public User getCreatedBy() { return createdBy; }
    public User getApprovedBy() { return approvedBy; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setStatus(VersionStatus status) { this.status = status; }
    public void setDocument(Document document) { this.document = document; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }
    public void setApprovedBy(User approvedBy) { this.approvedBy = approvedBy; }
    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }

    public void approve() { this.status = VersionStatus.APPROVED; }
    public void reject() { this.status = VersionStatus.REJECTED; }
}