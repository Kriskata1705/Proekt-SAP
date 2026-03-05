package com.example.documentsystem.model;
import jakarta.persistence.*;

@Entity
public class User {

    @Id
    @GeneratedValue
    protected Long id;

    @Column(unique = true)
    protected String username;

    protected String password;

    @Enumerated(EnumType.STRING)
    protected Role role;

    public User() {}

    public User(String username, String password, Role role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public void setRole(Role role) {
        this.role = role;
    }
    public Role getRole() {
        return role;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }
}