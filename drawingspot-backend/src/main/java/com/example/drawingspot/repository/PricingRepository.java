package com.example.drawingspot.repository;

import com.example.drawingspot.model.Pricing;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PricingRepository extends JpaRepository<Pricing, Long> {

    // Find price by size + type + colorType
    Optional<Pricing> findBySizeAndTypeAndColorType(
            String size,
            String type,
            String colorType
    );
}