package com.example.drawingspot.repository;

import com.example.drawingspot.model.Gallery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GalleryRepository extends JpaRepository<Gallery, Long> {

    // Filter gallery by category (Single / Couple / Family)
    List<Gallery> findByCategory(String category);
}