package com.example.drawingspot.service.impl;

import com.example.drawingspot.model.Order;
import com.example.drawingspot.model.User;
import com.example.drawingspot.repository.OrderRepository;
import com.example.drawingspot.service.WhatsAppService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class WhatsAppServiceImpl implements WhatsAppService {

    private final OrderRepository orderRepository;
    private RestTemplate restTemplate = new RestTemplate();

    @Value("${whatsapp.api.url}")
    private String apiUrl;

    @Value("${whatsapp.api.token}")
    private String apiToken;

    @Value("${whatsapp.api.phone-number-id}")
    private String phoneNumberId;

    @Value("${whatsapp.admin.phone-number}")
    private String adminPhoneNumber;

    @Override
    @Async
    @Transactional
    public void sendCustomerOrderConfirmationAsync(Long orderId) {
        log.info("Starting async customer WhatsApp confirmation for order ID: {}", orderId);
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            log.error("Order {} not found for WhatsApp confirmation", orderId);
            return;
        }

        Order order = orderOpt.get();
        User user = order.getUser();
        if (user == null || user.getPhoneNumber() == null || user.getPhoneNumber().isEmpty()) {
            log.warn("Customer phone number is missing for order {}", orderId);
            updateNotificationError(order, "Customer phone number is missing", true);
            return;
        }

        String customerName = user.getName();
        String phoneNumber = user.getPhoneNumber();
        String drawingType = order.getType() != null ? order.getType() : "Custom Drawing";
        Double amount = order.getPrice() != null ? order.getPrice() : 0.0;

        String messageText = String.format(
            "🎨 Drawing Spot\n\n" +
            "Hello %s,\n\n" +
            "Thank you for your order.\n\n" +
            "Order ID: %d\n" +
            "Service: %s\n" +
            "Amount: ₹%.2f\n\n" +
            "Your order has been received successfully and our artists will begin working on it shortly.\n\n" +
            "Thank you for choosing Drawing Spot ❤️",
            customerName, orderId, drawingType, amount
        );

        try {
            sendMessage(phoneNumber, messageText);
            order.setCustomerWhatsappSent(true);
            order.setCustomerWhatsappSentAt(LocalDateTime.now());
            orderRepository.save(order);
            log.info("Successfully sent customer WhatsApp confirmation for order {}", orderId);
        } catch (Exception e) {
            log.error("Failed to send customer WhatsApp confirmation for order {}: {}", orderId, e.getMessage());
            updateNotificationError(order, "Customer Message Failed: " + e.getMessage(), true);
        }
    }

    @Override
    @Async
    @Transactional
    public void sendAdminOrderAlertAsync(Long orderId) {
        log.info("Starting async admin WhatsApp alert for order ID: {}", orderId);
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            log.error("Order {} not found for WhatsApp alert", orderId);
            return;
        }

        Order order = orderOpt.get();
        User user = order.getUser();
        if (adminPhoneNumber == null || adminPhoneNumber.isEmpty()) {
            log.warn("Admin phone number is not configured");
            updateNotificationError(order, "Admin phone number is not configured", false);
            return;
        }

        String customerName = user != null && user.getName() != null ? user.getName() : "Unknown";
        String customerPhone = (user != null && user.getPhoneNumber() != null) ? user.getPhoneNumber() : "N/A";
        String customerEmail = (user != null && user.getEmail() != null) ? user.getEmail() : "N/A";
        String drawingType = order.getType() != null ? order.getType() : "Custom Drawing";
        Double amount = order.getPrice() != null ? order.getPrice() : 0.0;

        String messageText = String.format(
            "🛒 New Order Received\n\n" +
            "Order ID: %d\n" +
            "Customer: %s\n" +
            "Phone: %s\n" +
            "Email: %s\n" +
            "Service: %s\n" +
            "Amount: ₹%.2f\n\n" +
            "Please review the order in the admin dashboard.",
            orderId, customerName, customerPhone, customerEmail, drawingType, amount
        );

        try {
            sendMessage(adminPhoneNumber, messageText);
            order.setAdminWhatsappSent(true);
            order.setAdminWhatsappSentAt(LocalDateTime.now());
            orderRepository.save(order);
            log.info("Successfully sent admin WhatsApp alert for order {}", orderId);
        } catch (Exception e) {
            log.error("Failed to send admin WhatsApp alert for order {}: {}", orderId, e.getMessage());
            updateNotificationError(order, "Admin Message Failed: " + e.getMessage(), false);
        }
    }

    private void sendMessage(String toPhoneNumber, String text) {
        if (apiToken == null || apiToken.isEmpty() || phoneNumberId == null || phoneNumberId.isEmpty()) {
            throw new RuntimeException("WhatsApp API token or phone number ID is missing.");
        }

        String endpoint = String.format("%s/%s/messages", apiUrl, phoneNumberId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiToken);

        Map<String, Object> textBody = new HashMap<>();
        textBody.put("preview_url", false);
        textBody.put("body", text);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("messaging_product", "whatsapp");
        requestBody.put("recipient_type", "individual");
        requestBody.put("to", toPhoneNumber);
        requestBody.put("type", "text");
        requestBody.put("text", textBody);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        restTemplate.postForEntity(endpoint, requestEntity, String.class);
    }

    private void updateNotificationError(Order order, String errorMsg, boolean isCustomerError) {
        String existingError = order.getNotificationError() != null ? order.getNotificationError() : "";
        String newError = existingError.isEmpty() ? errorMsg : existingError + " | " + errorMsg;
        if (newError.length() > 1000) {
            newError = newError.substring(0, 1000);
        }
        order.setNotificationError(newError);
        orderRepository.save(order);
    }
}
