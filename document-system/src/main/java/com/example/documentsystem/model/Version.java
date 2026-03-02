package com.example.documentsystem.model;

import java.time.LocalDateTime;

public class Version {

    private String content;
    private User creator;
    private String status;
    private LocalDateTime createdAt;

    public Version(String content, User creator) {
        this.content = content;
        this.creator = creator;
        this.status = "PENDING";
        this.createdAt = LocalDateTime.now();
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }
}