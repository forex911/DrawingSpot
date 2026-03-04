package com.example.drawingspot.service;

import com.example.drawingspot.model.Pricing;

import java.util.List;
import java.util.Optional;

public interface PricingService {

    // Add pricing
    Pricing addPricing(Pricing pricing);

    // Get all pricing
    List<Pricing> getAllPricing();

    // Find price by size + type + colorType
    Optional<Pricing> findPrice(String size, String type, String colorType);

    // Delete pricing
    void deletePricing(Long id);
}