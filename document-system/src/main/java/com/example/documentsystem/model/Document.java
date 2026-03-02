package com.example.documentsystem.model;

import java.util.*;

public class Document {

    private String title;
    private Author author;
    private List<Version> versions = new ArrayList<>();

    public Document(String title, Author author) {
        this.title = title;
        this.author = author;
    }

    public void addVersion(String content) {
        Version v = new Version(content, author);
        versions.add(v);
    }

    public List<Version> getVersions() {
        return versions;
    }

    @Override
    public String toString() {
        return "Document: " + title;
    }
}
