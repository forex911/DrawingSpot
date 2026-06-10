package com.example.drawingspot.service;

import com.example.drawingspot.model.Order;
import com.example.drawingspot.model.User;
import com.example.drawingspot.repository.OrderRepository;
import com.example.drawingspot.service.impl.WhatsAppServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WhatsAppServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private WhatsAppServiceImpl whatsAppService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(whatsAppService, "apiUrl", "https://graph.facebook.com/v17.0");
        ReflectionTestUtils.setField(whatsAppService, "apiToken", "dummy_token");
        ReflectionTestUtils.setField(whatsAppService, "phoneNumberId", "12345");
        ReflectionTestUtils.setField(whatsAppService, "adminPhoneNumber", "+1234567890");
        ReflectionTestUtils.setField(whatsAppService, "restTemplate", restTemplate);
    }

    @Test
    void testSendCustomerOrderConfirmation_Success() {
        User user = new User();
        user.setId(1L);
        user.setName("John Doe");
        user.setPhoneNumber("+0987654321");

        Order order = new Order();
        order.setId(10L);
        order.setUser(user);
        order.setType("A4");
        order.setPrice(500.0);
        order.setCustomerWhatsappSent(false);

        when(orderRepository.findById(10L)).thenReturn(Optional.of(order));
        when(restTemplate.postForEntity(anyString(), any(HttpEntity.class), eq(String.class)))
                .thenReturn(ResponseEntity.ok("Success"));

        whatsAppService.sendCustomerOrderConfirmationAsync(10L);

        verify(orderRepository).save(order);
        assertTrue(order.getCustomerWhatsappSent());
        assertNotNull(order.getCustomerWhatsappSentAt());
    }

    @Test
    void testSendCustomerOrderConfirmation_Failure() {
        User user = new User();
        user.setId(1L);
        user.setName("John Doe");
        user.setPhoneNumber("+0987654321");

        Order order = new Order();
        order.setId(10L);
        order.setUser(user);
        order.setType("A4");
        order.setPrice(500.0);

        when(orderRepository.findById(10L)).thenReturn(Optional.of(order));
        when(restTemplate.postForEntity(anyString(), any(HttpEntity.class), eq(String.class)))
                .thenThrow(new RuntimeException("API Error"));

        whatsAppService.sendCustomerOrderConfirmationAsync(10L);

        verify(orderRepository).save(order);
        assertNotNull(order.getNotificationError());
        assertTrue(order.getNotificationError().contains("API Error"));
    }
}
