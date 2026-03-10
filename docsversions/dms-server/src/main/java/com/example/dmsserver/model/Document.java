package com.example.dmsserver.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
public class Document {

    @Id
    @GeneratedValue
    private UUID id;

    private String title;

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Version> versions = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "authod_id", nullable = false)
    private User author;

    public Document() {}

    public Document(String title, User author) {
        this.title = title;
        this.author = author;
        this.createdAt = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public String getTitle() { return title; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public List<Version> getVersions() { return versions; }
    public User getAuthor() { return author; }

    public void setAuthor(User author) { this.author = author; }

    public void addVersion(Version version) {
        versions.add(version);
        version.setDocument(this);
    }
}