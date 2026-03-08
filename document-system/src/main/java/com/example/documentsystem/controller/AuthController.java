package com.example.documentsystem.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.documentsystem.dto.LoginRequest;
import com.example.documentsystem.dto.RegisterRequest;
import com.example.documentsystem.model.User;
import com.example.documentsystem.service.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        return authService.register(
                request.getUsername(),
                request.getPassword(),
                request.getRole()
        );
    }

    @PostMapping("/login")
    public User login(@RequestBody LoginRequest request) {
        return authService.login(
                request.getUsername(),
                request.getPassword()
        );
    }
}