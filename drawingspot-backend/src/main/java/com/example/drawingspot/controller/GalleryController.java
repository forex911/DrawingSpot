package com.example.drawingspot.controller;

import com.example.drawingspot.model.Gallery;
import com.example.drawingspot.service.GalleryService;
import lombok.RequiredArgsConstructor;
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
@RequestMapping("/api/gallery")
@RequiredArgsConstructor
public class GalleryController {

    private final GalleryService galleryService;

    // Add Image
    @PostMapping
    public Gallery addImage(@RequestBody Gallery gallery) {
        return galleryService.addImage(gallery);
    }

    // Upload Image File
    @PostMapping("/{id}/image")
    public ResponseEntity<Gallery> uploadImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {

        Path dir = Paths.get("uploads/gallery");
        Files.createDirectories(dir);

        String ext = "";
        String original = file.getOriginalFilename();
        if (original != null && original.contains(".")) {
            ext = original.substring(original.lastIndexOf('.'));
        }
        String filename = "gallery_" + id + "_" + UUID.randomUUID().toString().substring(0, 8) + ext;
        Path dest = dir.resolve(filename);
        Files.copy(file.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);

        String imageUrl = "/uploads/gallery/" + filename;
        Gallery gallery = galleryService.getImageById(id).orElseThrow(() -> new RuntimeException("Gallery item not found"));
        gallery.setImageUrl(imageUrl);
        return ResponseEntity.ok(galleryService.addImage(gallery));
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