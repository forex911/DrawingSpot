package com.example.drawingspot.repository;

import com.example.drawingspot.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    // Fetch all chat messages for a specific conversation (user), sorted by time
    List<ChatMessage> findByConversationUserIdOrderBySentAtAsc(Long conversationUserId);

    // Count unread messages for a specific user conversation, not sent by the
    // current reader
    long countByConversationUserIdAndSenderIdNotAndIsReadFalse(Long conversationUserId, Long readerId);

    // Get a list of users mapped to their unread count (for Admin Panel)
    @Query("SELECT c.conversationUserId, COUNT(c) FROM ChatMessage c WHERE c.sender.role = 'USER' AND c.isRead = false GROUP BY c.conversationUserId")
    List<Object[]> countUnreadFromUsers();

    // Mark messages as read
    @Modifying
    @Query("UPDATE ChatMessage c SET c.isRead = true WHERE c.conversationUserId = :conversationUserId AND c.sender.id != :readerId AND c.isRead = false")
    void markAsReadByConversationUserIdAndSenderIdNot(
            @org.springframework.data.repository.query.Param("conversationUserId") Long conversationUserId,
            @org.springframework.data.repository.query.Param("readerId") Long readerId);
}
