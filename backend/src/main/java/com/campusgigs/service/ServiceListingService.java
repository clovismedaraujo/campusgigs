package com.campusgigs.service;

import com.campusgigs.dto.ServiceListingRequest;
import com.campusgigs.dto.ServiceListingResponse;
import com.campusgigs.exception.InvalidServiceListingException;
import com.campusgigs.exception.ResourceNotFoundException;
import com.campusgigs.model.Category;
import com.campusgigs.model.ServiceListing;
import com.campusgigs.model.User;
import com.campusgigs.repository.CategoryRepository;
import com.campusgigs.repository.ServiceListingRepository;
import com.campusgigs.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class ServiceListingService {

    private final ServiceListingRepository serviceListingRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    @Transactional
    public ServiceListingResponse createListing(ServiceListingRequest request) {
        Category category = resolveCategory(request);

        User provider = userRepository.findById(request.getProviderId())
                .orElseThrow(() -> new ResourceNotFoundException("Prestador de serviço não encontrado."));

        ServiceListing listing = ServiceListing.builder()
                .title(request.getTitle().trim())
                .description(request.getDescription().trim())
                .price(request.getPrice())
                .availability(request.getAvailability().trim())
                .category(category)
                .provider(provider)
                .active(true)
                .build();

        ServiceListing saved = serviceListingRepository.save(listing);
        return ServiceListingResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<ServiceListingResponse> getActiveListings(String categoryName, String search) {
        List<ServiceListing> listings = serviceListingRepository.findByActiveTrue();

        return listings.stream()
                .filter(listing -> {
                    if (categoryName == null || categoryName.isBlank()) {
                        return true;
                    }
                    return listing.getCategory().getName().equalsIgnoreCase(categoryName.trim());
                })
                .filter(listing -> {
                    if (search == null || search.isBlank()) {
                        return true;
                    }
                    String term = search.trim().toLowerCase(Locale.ROOT);
                    return listing.getTitle().toLowerCase(Locale.ROOT).contains(term)
                            || listing.getDescription().toLowerCase(Locale.ROOT).contains(term)
                            || listing.getCategory().getName().toLowerCase(Locale.ROOT).contains(term);
                })
                .map(ServiceListingResponse::fromEntity)
                .toList();
    }

    private Category resolveCategory(ServiceListingRequest request) {
        if (request.getCategoryId() != null) {
            return categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Categoria informada não encontrada."));
        }

        if (request.getCategoryName() != null && !request.getCategoryName().isBlank()) {
            String trimmedName = request.getCategoryName().trim();
            return categoryRepository.findByNameIgnoreCase(trimmedName)
                    .orElseGet(() -> categoryRepository.save(
                            Category.builder().name(trimmedName).build()
                    ));
        }

        throw new InvalidServiceListingException("A categoria do anúncio é obrigatória.");
    }
}
