package com.example.drawingspot.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Serves uploaded reference images at:
 * GET http://localhost:8080/uploads/orders/<filename>
 *
 * Files are stored on disk at <project-root>/uploads/orders/
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${upload.dir:uploads/orders}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Resolve the absolute path of the upload directory
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath();
        String resourceLocation = "file:" + uploadPath + "/";

        registry.addResourceHandler("/uploads/orders/**")
                .addResourceLocations(resourceLocation);

        Path galleryPath = Paths.get("uploads/gallery").toAbsolutePath();
        String galleryLocation = "file:" + galleryPath + "/";
        registry.addResourceHandler("/uploads/gallery/**")
                .addResourceLocations(galleryLocation);
    }
}
