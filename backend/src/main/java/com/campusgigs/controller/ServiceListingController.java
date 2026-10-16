package com.campusgigs.controller;

import com.campusgigs.dto.ServiceListingRequest;
import com.campusgigs.dto.ServiceListingResponse;
import com.campusgigs.service.ServiceListingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/listings")
@RequiredArgsConstructor
public class ServiceListingController {

    private final ServiceListingService serviceListingService;

    @PostMapping
    public ResponseEntity<ServiceListingResponse> createListing(@Valid @RequestBody ServiceListingRequest request) {
        ServiceListingResponse response = serviceListingService.createListing(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ServiceListingResponse>> getListings(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(serviceListingService.getActiveListings(category, search));
    }
}
