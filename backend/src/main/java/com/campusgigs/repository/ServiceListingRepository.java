package com.campusgigs.repository;

import com.campusgigs.model.ServiceListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceListingRepository extends JpaRepository<ServiceListing, Long> {
    List<ServiceListing> findByActiveTrue();
    List<ServiceListing> findByCategoryIdAndActiveTrue(Long categoryId);
    List<ServiceListing> findByProviderId(Long providerId);
    List<ServiceListing> findByTitleContainingIgnoreCaseAndActiveTrue(String title);
}
