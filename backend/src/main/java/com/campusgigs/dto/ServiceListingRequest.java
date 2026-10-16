package com.campusgigs.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceListingRequest {

    @NotBlank(message = "O título do anúncio é obrigatório")
    private String title;

    private Long categoryId;

    private String categoryName;

    @NotBlank(message = "A descrição é obrigatória")
    private String description;

    @NotNull(message = "O preço é obrigatório")
    @DecimalMin(value = "0.0", inclusive = true, message = "O preço não pode ser negativo")
    private BigDecimal price;

    @NotBlank(message = "A disponibilidade é obrigatória")
    private String availability;

    @NotNull(message = "O prestador do serviço é obrigatório")
    private Long providerId;
}
