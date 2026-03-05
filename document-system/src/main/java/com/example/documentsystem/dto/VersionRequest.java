package com.example.documentsystem.dto;

public class VersionRequest {
     private String content;
    public VersionRequest(String content) {
        this.content = content;
    }
    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }
    
}
