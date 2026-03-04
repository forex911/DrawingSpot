package com.example.drawingspot.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pricing")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pricing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String size;      // A5 - A1
    private String type;      // Single / Couple / Family
    private String colorType; // Color / BlackWhite

    private Double price;
}