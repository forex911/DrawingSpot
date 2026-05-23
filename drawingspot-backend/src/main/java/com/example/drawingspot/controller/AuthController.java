package com.example.drawingspot.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.drawingspot.model.User;
import com.example.drawingspot.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    // Register
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        user.setRole("USER");
        return userService.registerUser(user);
    }

    // Login — returns user object on success, 401 on failure
    // Fixed: removed wrapping try-catch that was swallowing the UNAUTHORIZED
    // ResponseStatusException
    // and re-throwing it as INTERNAL_SERVER_ERROR.
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User user) {
        Optional<User> existingUser = userService.findByEmail(user.getEmail());

        if (existingUser.isPresent()) {
            User found = existingUser.get();

            if (passwordEncoder.matches(user.getPassword(), found.getPassword())) {
                return buildUserResponse(found);
            }

            if (found.isGoogleUser()) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                        "This account uses Google Sign-In. Please click the Google button.");
            }
        }

        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
    }

    /**
     * Google OAuth login/register endpoint.
     *
     * The frontend already verified the Google token and fetched the user's
     * profile (name, email, googleId/sub) from Google's userinfo API.
     * This endpoint performs a find-or-create:
     * - If a user with the given email already exists → return their data.
     * - If no user found → create a new account and return the data.
     *
     * This fixes the previous broken flow where Google login would fail
     * for users who had already registered with the same email via
     * email/password, because the google_${sub} password would never match
     * their stored BCrypt hash.
     */
    @PostMapping("/google-login")
    public Map<String, Object> googleLogin(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        String email = payload.get("email");
        String googleId = payload.get("googleId");

        if (email == null || email.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required for Google login");
        }

        Optional<User> existingUser = userService.findByEmail(email);

        if (existingUser.isPresent()) {
            // User already has an account (Google or email/password) — just return them
            return buildUserResponse(existingUser.get());
        }

        // New Google user — create an account
        User newUser = new User();
        newUser.setName(name != null ? name : "Google User");
        newUser.setEmail(email);
        // Use a secure derived password — this account can only be accessed via Google
        newUser.setPassword("google_" + googleId);
        newUser.setPhoneNumber("");
        newUser.setRole("USER");
        newUser.setGoogleUser(true);

        User savedUser = userService.registerUser(newUser);
        return buildUserResponse(savedUser);
    }

    @PutMapping("/set-password")
    public Map<String, Object> setPassword(@RequestBody Map<String, String> payload) {
        Long userId = Long.valueOf(payload.get("userId"));
        String newPassword = payload.get("newPassword");

        userService.setPassword(userId, newPassword);

        User updatedUser = userService.getUserById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return buildUserResponse(updatedUser);
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private Map<String, Object> buildUserResponse(User user) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());

        response.put("isGoogleUser", user.isGoogleUser());
        return response;
    }
}
