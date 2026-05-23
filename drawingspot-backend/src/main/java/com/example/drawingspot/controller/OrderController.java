package com.example.drawingspot.controller;

import com.example.drawingspot.model.Order;
import com.example.drawingspot.service.OrderService;
import com.example.drawingspot.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final CloudinaryService cloudinaryService;

    // ── Create Order (JSON body) ───────────────────────────────────────────
    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        return orderService.createOrder(order);
    }

    // ── Upload Reference Image for an Order ───────────────────────────────
    // POST /api/orders/{id}/image (multipart/form-data, field name = "file")
    @PostMapping("/{id}/image")
    public ResponseEntity<Order> uploadImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {

        // Upload to Cloudinary
        String imageUrl = cloudinaryService.uploadImage(file);
        Order updated = orderService.updateOrderImage(id, imageUrl);
        return ResponseEntity.ok(updated);
    }

    // ── Get All Orders ─────────────────────────────────────────────────────
    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    // ── Get Order by ID ───────────────────────────────────────────────────
    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    // ── Get Orders by User ────────────────────────────────────────────────
    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUser(@PathVariable Long userId) {
        return orderService.getOrdersByUser(userId);
    }

    // ── Update Order Status ───────────────────────────────────────────────
    @PutMapping("/{id}/status")
    public Order updateStatus(@PathVariable Long id,
            @RequestParam String status) {
        return orderService.updateOrderStatus(id, status);
    }

    // ── Update Order Price ───────────────────────────────────────────────
    @PutMapping("/{id}/price")
    public Order updatePrice(@PathVariable Long id,
            @RequestParam Double price) {
        return orderService.updateOrderPrice(id, price);
    }

    // ── Delete Order ──────────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public String deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return "Order Deleted Successfully";
    }
}