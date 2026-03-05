package com.example.documentsystem.dto;

public class DocumentRequest {

    private String title;
    private String description;

    public DocumentRequest(String title, String description) {
        this.title = title;
        this.description = description;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }
}
