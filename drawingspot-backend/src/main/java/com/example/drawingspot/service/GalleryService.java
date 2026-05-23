package com.example.drawingspot.service;

import com.example.drawingspot.model.Gallery;

import java.util.List;
import java.util.Optional;

public interface GalleryService {

    // Add new gallery image
    Gallery addImage(Gallery gallery);

    // Get all images
    List<Gallery> getAllImages();

    // Get image by ID
    Optional<Gallery> getImageById(Long id);

    // Filter by category
    List<Gallery> getByCategory(String category);

    // Delete image
    void deleteImage(Long id);
}