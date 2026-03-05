package com.example.documentsystem.service;
import org.springframework.stereotype.Service;
import com.example.documentsystem.model.Role;
import com.example.documentsystem.model.User;
import com.example.documentsystem.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public String register(String username, String password, Role role) {

        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(password); // по-късно ще криптираме
        user.setRole(role);

        userRepository.save(user);

        return "User registered successfully";
    }

    public User login(String username, String password) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }
}
