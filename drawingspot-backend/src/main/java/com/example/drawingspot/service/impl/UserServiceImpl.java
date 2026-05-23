package com.example.drawingspot.service.impl;

import com.example.drawingspot.model.User;
import com.example.drawingspot.repository.UserRepository;
import com.example.drawingspot.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public User registerUser(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("USER");
        if (user.getPhoneNumber() == null) {
            user.setPhoneNumber("");
        }

        return userRepository.save(user);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public void setPassword(Long userId, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setGoogleUser(false); // They now have a real password, so they can use normal login
        userRepository.save(user);
    }

    @Override
    public User updateProfile(Long userId, User updatedDetails) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updatedDetails.getName() != null) user.setName(updatedDetails.getName());
        if (updatedDetails.getUsername() != null) user.setUsername(updatedDetails.getUsername());
        if (updatedDetails.getPhoneNumber() != null) user.setPhoneNumber(updatedDetails.getPhoneNumber());
        if (updatedDetails.getProfilePicture() != null) user.setProfilePicture(updatedDetails.getProfilePicture());
        if (updatedDetails.getCountry() != null) user.setCountry(updatedDetails.getCountry());
        if (updatedDetails.getState() != null) user.setState(updatedDetails.getState());
        if (updatedDetails.getCity() != null) user.setCity(updatedDetails.getCity());
        if (updatedDetails.getPincode() != null) user.setPincode(updatedDetails.getPincode());
        if (updatedDetails.getAddress() != null) user.setAddress(updatedDetails.getAddress());
        
        return userRepository.save(user);
    }
}