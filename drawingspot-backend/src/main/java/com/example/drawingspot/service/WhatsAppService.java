package com.example.drawingspot.service;

public interface WhatsAppService {
    void sendCustomerOrderConfirmationAsync(Long orderId);
    void sendAdminOrderAlertAsync(Long orderId);
}
