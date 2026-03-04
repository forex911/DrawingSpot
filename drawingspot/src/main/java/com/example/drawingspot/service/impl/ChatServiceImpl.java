package com.example.drawingspot.service.impl;

import com.example.drawingspot.model.ChatMessage;
import com.example.drawingspot.model.Order;
import com.example.drawingspot.model.User;
import com.example.drawingspot.repository.ChatMessageRepository;
import com.example.drawingspot.repository.OrderRepository;
import com.example.drawingspot.repository.UserRepository;
import com.example.drawingspot.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Override
    public List<ChatMessage> getMessagesByConversationUserId(Long conversationUserId) {
        return chatMessageRepository.findByConversationUserIdOrderBySentAtAsc(conversationUserId);
    }

    @Override
    public ChatMessage sendMessage(Long conversationUserId, Long senderId, String content) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + senderId));

        ChatMessage message = ChatMessage.builder()
                .conversationUserId(conversationUserId)
                .sender(sender)
                .content(content)
                .build();

        return chatMessageRepository.save(message);
    }

    @Override
    @Transactional
    public void markMessagesAsRead(Long conversationUserId, Long readerId) {
        chatMessageRepository.markAsReadByConversationUserIdAndSenderIdNot(conversationUserId, readerId);
    }

    @Override
    public long getUnreadCountForUser(Long conversationUserId, Long readerId) {
        return chatMessageRepository.countByConversationUserIdAndSenderIdNotAndIsReadFalse(conversationUserId,
                readerId);
    }

    @Override
    public Map<Long, Long> getAdminUnreadCounts() {
        List<Object[]> results = chatMessageRepository.countUnreadFromUsers();
        Map<Long, Long> counts = new HashMap<>();
        for (Object[] row : results) {
            Long userId = (Long) row[0];
            Long count = (Long) row[1];
            counts.put(userId, count);
        }
        return counts;
    }
}
