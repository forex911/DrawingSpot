package com.example.drawingspot.service.impl;

import com.example.drawingspot.model.Gallery;
import com.example.drawingspot.repository.GalleryRepository;
import com.example.drawingspot.service.GalleryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GalleryServiceImpl implements GalleryService {

    private final GalleryRepository galleryRepository;

    @Override
    public Gallery addImage(Gallery gallery) {
        return galleryRepository.save(gallery);
    }

    @Override
    public List<Gallery> getAllImages() {
        return galleryRepository.findAll();
    }

    @Override
    public Optional<Gallery> getImageById(Long id) {
        return galleryRepository.findById(id);
    }

    @Override
    public List<Gallery> getByCategory(String category) {
        return galleryRepository.findByCategory(category);
    }

    @Override
    public void deleteImage(Long id) {
        galleryRepository.deleteById(id);
    }
}