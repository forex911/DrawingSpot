package com.example.drawingspot.controller;

import com.example.drawingspot.model.ChatMessage;
import com.example.drawingspot.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    // Get all messages for a specific user conversation
    @GetMapping("/user/{userId}")
    public List<ChatMessage> getMessages(@PathVariable Long userId) {
        return chatService.getMessagesByConversationUserId(userId);
    }

    // Send a new message
    @PostMapping("/user/{userId}")
    public ChatMessage sendMessage(
            @PathVariable Long userId,
            @RequestBody Map<String, Object> payload) {

        // Extract senderId and content from the payload map
        Long senderId = Long.valueOf(payload.get("senderId").toString());
        String content = payload.get("content").toString();

        return chatService.sendMessage(userId, senderId, content);
    }

    // Mark messages as read by a specific reader
    @PutMapping("/user/{userId}/read")
    public void markAsRead(@PathVariable Long userId, @RequestParam Long readerId) {
        chatService.markMessagesAsRead(userId, readerId);
    }

    // Get unread count for a specific user
    @GetMapping("/user/{userId}/unread-count")
    public long getUserUnreadCount(@PathVariable Long userId, @RequestParam Long readerId) {
        return chatService.getUnreadCountForUser(userId, readerId);
    }

    // Get unread counts for admin
    @GetMapping("/admin/unread-counts")
    public Map<Long, Long> getAdminUnreadCounts() {
        return chatService.getAdminUnreadCounts();
    }
}
