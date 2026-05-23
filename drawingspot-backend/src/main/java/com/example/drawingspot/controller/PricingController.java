package com.example.drawingspot.controller;

import com.example.drawingspot.model.Pricing;
import com.example.drawingspot.service.PricingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pricing")
@RequiredArgsConstructor
public class PricingController {

    private final PricingService pricingService;

    // Add Pricing
    @PostMapping
    public Pricing addPricing(@RequestBody Pricing pricing) {
        return pricingService.addPricing(pricing);
    }

    // Get All Pricing
    @GetMapping
    public List<Pricing> getAllPricing() {
        return pricingService.getAllPricing();
    }

    // Find Price
    @GetMapping("/search")
    public Pricing findPrice(@RequestParam String size,
                             @RequestParam String type,
                             @RequestParam String colorType) {

        return pricingService
                .findPrice(size, type, colorType)
                .orElseThrow(() -> new RuntimeException("Price not found"));
    }

    // Delete Pricing
    @DeleteMapping("/{id}")
    public String deletePricing(@PathVariable Long id) {
        pricingService.deletePricing(id);
        return "Pricing Deleted Successfully";
    }
}