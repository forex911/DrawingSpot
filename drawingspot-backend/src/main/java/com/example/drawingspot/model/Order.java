package com.example.drawingspot.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String size; // A5, A4, A3, A2, A1
    private String type; // Single, Couple, Family
    private String colorType; // Color / BlackWhite
    private Double price;
    private String frameOption; // WithFrame / WithoutFrame
    private String status; // Received, Sketching, Delivered
    private String deliveryAddress;

    @Column(length = 1000)
    private String notes;

    // Path to the reference photo uploaded by the customer (e.g.
    // /uploads/orders/5.jpg)
    private String referenceImagePath;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "Received";
        }
    }

    // Many orders belong to one user
    // @JsonIgnoreProperties prevents serializing User.orders back from here
    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({ "orders", "password" })
    private User user;
}