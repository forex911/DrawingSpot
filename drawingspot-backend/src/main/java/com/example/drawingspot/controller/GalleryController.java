package com.example.drawingspot.controller;

import com.example.drawingspot.model.Gallery;
import com.example.drawingspot.service.GalleryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gallery")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class GalleryController {

    private final GalleryService galleryService;

    // Add Image
    @PostMapping
    public Gallery addImage(@RequestBody Gallery gallery) {
        return galleryService.addImage(gallery);
    }

    // Get All Images
    @GetMapping
    public List<Gallery> getAllImages() {
        return galleryService.getAllImages();
    }

    // Get By Category
    @GetMapping("/category/{category}")
    public List<Gallery> getByCategory(@PathVariable String category) {
        return galleryService.getByCategory(category);
    }

    // Delete Image
    @DeleteMapping("/{id}")
    public String deleteImage(@PathVariable Long id) {
        galleryService.deleteImage(id);
        return "Image Deleted Successfully";
    }
}