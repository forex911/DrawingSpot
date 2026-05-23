package com.example.drawingspot.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "gallery")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Gallery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String imageUrl;

    private String category; // Single / Couple / Family

    @Column(length = 1000)
    private String description;
}