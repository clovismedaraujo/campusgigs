package com.campusgigs.dto;

import com.campusgigs.model.ServiceListing;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceListingResponse {

    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private String availability;
    private Long categoryId;
    private String categoryName;
    private Long providerId;
    private String providerName;
    private String providerEmail;
    private String providerCourse;
    private String providerPhone;
    private Boolean active;
    private LocalDateTime createdAt;

    public static ServiceListingResponse fromEntity(ServiceListing listing) {
        return ServiceListingResponse.builder()
                .id(listing.getId())
                .title(listing.getTitle())
                .description(listing.getDescription())
                .price(listing.getPrice())
                .availability(listing.getAvailability())
                .categoryId(listing.getCategory().getId())
                .categoryName(listing.getCategory().getName())
                .providerId(listing.getProvider().getId())
                .providerName(listing.getProvider().getName())
                .providerEmail(listing.getProvider().getInstitutionalEmail())
                .providerCourse(listing.getProvider().getCourse())
                .providerPhone(listing.getProvider().getPhone())
                .active(listing.getActive())
                .createdAt(listing.getCreatedAt())
                .build();
    }
}
