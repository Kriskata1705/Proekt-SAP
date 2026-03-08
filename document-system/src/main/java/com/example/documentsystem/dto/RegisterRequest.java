package com.example.documentsystem.dto;

import com.example.documentsystem.model.Role;

public class RegisterRequest {
    private String username;
    private String password;
    private Role role;

    public RegisterRequest(String username, String password) {
        this.username = username;
        this.password = password;
        this.role =Role.READER;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }
    public Role getRole() {
        return role;
    }
}
