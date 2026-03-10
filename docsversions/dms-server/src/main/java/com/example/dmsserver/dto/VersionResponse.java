package com.example.dmsserver.dto;

import java.util.UUID;

public class VersionResponse {

    private UUID id;
    private int versionNumber;
    private String content;
    private String status;

    public VersionResponse(UUID id, int versionNumber, String content, String status) {
        this.id = id;
        this.versionNumber = versionNumber;
        this.content = content;
        this.status = status;
    }

    public UUID getId() { return id; }
    public int getVersionNumber() { return versionNumber; }
    public String getContent() { return content; }
    public String getStatus() { return status; }
}
