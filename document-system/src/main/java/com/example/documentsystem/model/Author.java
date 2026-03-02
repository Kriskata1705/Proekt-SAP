package com.example.documentsystem.model;
public class Author extends User {

    public Author(String username, String password, Role role) {
        super(username, password, role);
    }

    @Override
    public Role getRole() {
        return Role.AUTHOR;
    }

    public Document createDocument(String title) {
        return new Document(title, this);
    }
}