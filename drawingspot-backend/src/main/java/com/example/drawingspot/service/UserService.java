package com.example.drawingspot.service;

import com.example.drawingspot.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

    // Register new user
    User registerUser(User user);

    // Find user by email (Login)
    Optional<User> findByEmail(String email);

    // Get user by ID
    Optional<User> getUserById(Long id);

    // Delete user
    void deleteUser(Long id);

    // Set/update password (for Google users enabling email login)
    void setPassword(Long userId, String newPassword);
}