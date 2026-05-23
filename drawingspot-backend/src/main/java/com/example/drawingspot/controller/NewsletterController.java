package com.example.drawingspot.controller;

import com.example.drawingspot.model.NewsletterSubscription;
import com.example.drawingspot.repository.NewsletterSubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/newsletter")
public class NewsletterController {

    @Autowired
    private NewsletterSubscriptionRepository repository;

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@RequestBody NewsletterSubscription request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        Optional<NewsletterSubscription> existing = repository.findByEmail(request.getEmail());
        if (existing.isPresent()) {
            return ResponseEntity.badRequest().body("Email is already subscribed");
        }

        request.setSubscribedAt(LocalDateTime.now());
        repository.save(request);

        return ResponseEntity.ok("Successfully subscribed to newsletter");
    }
}
