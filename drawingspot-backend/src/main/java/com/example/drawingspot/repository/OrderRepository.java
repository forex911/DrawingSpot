package com.example.drawingspot.repository;

import com.example.drawingspot.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // Get all orders of a specific user
    List<Order> findByUserId(Long userId);

    // Get orders by status (Admin filtering)
    List<Order> findByStatus(String status);
}