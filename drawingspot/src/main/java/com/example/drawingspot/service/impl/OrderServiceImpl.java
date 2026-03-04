package com.example.drawingspot.service.impl;

import com.example.drawingspot.model.Order;
import com.example.drawingspot.model.Pricing;
import com.example.drawingspot.repository.OrderRepository;
import com.example.drawingspot.repository.PricingRepository;
import com.example.drawingspot.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final PricingRepository pricingRepository;

    @Override
    public Order createOrder(Order order) {

        // Auto price calculation — falls back to 0.0 if pricing table is not seeded
        try {
            pricingRepository
                    .findBySizeAndTypeAndColorType(
                            order.getSize(),
                            order.getType(),
                            order.getColorType())
                    .ifPresent(pricing -> order.setPrice(pricing.getPrice()));
        } catch (Exception e) {
            // Pricing not found — keep price as provided by client or 0.0
        }

        if (order.getPrice() == null) {
            order.setPrice(0.0);
        }

        return orderRepository.save(order);
    }

    @Override
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }

    @Override
    public Order updateOrderImage(Long orderId, String imagePath) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setReferenceImagePath(imagePath);
        return orderRepository.save(order);
    }

    @Override
    public Order updateOrderPrice(Long orderId, Double price) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setPrice(price);
        return orderRepository.save(order);
    }

    @Override
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}