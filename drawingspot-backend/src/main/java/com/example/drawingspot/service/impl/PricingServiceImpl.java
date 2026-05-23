package com.example.drawingspot.service.impl;

import com.example.drawingspot.model.Pricing;
import com.example.drawingspot.repository.PricingRepository;
import com.example.drawingspot.service.PricingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PricingServiceImpl implements PricingService {

    private final PricingRepository pricingRepository;

    @Override
    public Pricing addPricing(Pricing pricing) {
        return pricingRepository.save(pricing);
    }

    @Override
    public List<Pricing> getAllPricing() {
        return pricingRepository.findAll();
    }

    @Override
    public Optional<Pricing> findPrice(String size, String type, String colorType) {
        return pricingRepository
                .findBySizeAndTypeAndColorType(size, type, colorType);
    }

    @Override
    public void deletePricing(Long id) {
        pricingRepository.deleteById(id);
    }

    @Override
    public Pricing updatePricing(Long id, Pricing pricingDetails) {
        Pricing pricing = pricingRepository.findById(id).orElseThrow(() -> new RuntimeException("Pricing rule not found"));
        pricing.setSize(pricingDetails.getSize());
        pricing.setType(pricingDetails.getType());
        pricing.setColorType(pricingDetails.getColorType());
        pricing.setPrice(pricingDetails.getPrice());
        return pricingRepository.save(pricing);
    }
}