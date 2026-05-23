package com.example.drawingspot.service;

import com.example.drawingspot.model.Order;

import java.util.List;
import java.util.Optional;

public interface OrderService {

    // Create new order
    Order createOrder(Order order);

    // Get order by ID
    Optional<Order> getOrderById(Long id);

    // Get all orders
    List<Order> getAllOrders();

    // Get orders by user
    List<Order> getOrdersByUser(Long userId);

    // Update order status
    Order updateOrderStatus(Long orderId, String status);

    // Save the reference image path on an existing order
    Order updateOrderImage(Long orderId, String imagePath);

    // Update order price
    Order updateOrderPrice(Long orderId, Double price);

    // Delete order
    void deleteOrder(Long id);
}