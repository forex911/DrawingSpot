package com.example.drawingspot.controller;

import com.example.drawingspot.model.Order;
import com.example.drawingspot.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;

    @Value("${upload.dir:uploads/orders}")
    private String uploadDir;

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

        // Save to <project-root>/uploads/orders/
        Path dir = Paths.get(uploadDir);
        Files.createDirectories(dir);

        // Use orderId + UUID suffix to avoid collisions / cache issues
        String ext = "";
        String original = file.getOriginalFilename();
        if (original != null && original.contains(".")) {
            ext = original.substring(original.lastIndexOf('.'));
        }
        String filename = id + "_" + UUID.randomUUID().toString().substring(0, 8) + ext;
        Path dest = dir.resolve(filename);
        Files.copy(file.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);

        // Save the public URL path on the order record
        String imageUrl = "/uploads/orders/" + filename;
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