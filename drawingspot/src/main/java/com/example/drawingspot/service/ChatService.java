package com.example.drawingspot.service;

import com.example.drawingspot.model.ChatMessage;

import java.util.List;

public interface ChatService {

    // Get all messages for a specific user conversation
    List<ChatMessage> getMessagesByConversationUserId(Long conversationUserId);

    // Send a new message
    ChatMessage sendMessage(Long conversationUserId, Long senderId, String content);

    // Mark messages as read
    void markMessagesAsRead(Long conversationUserId, Long readerId);

    // Get unread count for a specific user
    long getUnreadCountForUser(Long conversationUserId, Long readerId);

    // Get unread count from all users for admin
    java.util.Map<Long, Long> getAdminUnreadCounts();
}
