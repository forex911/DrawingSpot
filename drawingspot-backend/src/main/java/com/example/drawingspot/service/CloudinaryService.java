package com.example.drawingspot.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) throws IOException {
        // Stream upload to Cloudinary (avoids loading entire file into memory)
        Map uploadResult = cloudinary.uploader().upload(file.getInputStream(), ObjectUtils.asMap(
                "folder", "drawingspot",
                "public_id", UUID.randomUUID().toString(),
                "resource_type", "auto"
        ));
        
        // Return the secure URL
        return uploadResult.get("secure_url").toString();
    }
}
