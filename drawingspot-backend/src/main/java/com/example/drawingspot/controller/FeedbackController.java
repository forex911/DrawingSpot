package com.example.drawingspot.controller;

import com.example.drawingspot.model.Feedback;
import com.example.drawingspot.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    /** Called by ContactUs form — saves the message */
    @PostMapping
    public ResponseEntity<?> submit(@RequestBody Feedback feedback) {
        if (feedback.getName() == null || feedback.getName().isBlank() ||
                feedback.getEmail() == null || feedback.getEmail().isBlank() ||
                feedback.getMessage() == null || feedback.getMessage().isBlank()) {
            return ResponseEntity.badRequest().body("Name, email and message are required.");
        }
        feedbackRepository.save(feedback);
        return ResponseEntity.ok("Message received. We'll get back to you soon!");
    }

    /** Called by Admin Panel — returns all feedbacks, newest first */
    @GetMapping
    public ResponseEntity<List<Feedback>> getAll() {
        return ResponseEntity.ok(feedbackRepository.findAllByOrderBySubmittedAtDesc());
    }
}
