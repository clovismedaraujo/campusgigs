package com.campusgigs.controller;

import com.campusgigs.dto.ServiceListingRequest;
import com.campusgigs.model.Category;
import com.campusgigs.model.User;
import com.campusgigs.repository.CategoryRepository;
import com.campusgigs.repository.ServiceListingRepository;
import com.campusgigs.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ServiceListingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ServiceListingRepository serviceListingRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    private User provider;
    private Category category;

    @BeforeEach
    void setUp() {
        serviceListingRepository.deleteAll();
        categoryRepository.deleteAll();
        userRepository.deleteAll();

        provider = userRepository.save(User.builder()
                .name("Clóvis Araújo")
                .institutionalEmail("clovis@ufrn.edu.br")
                .password("$2a$10$encryptedPasswordHash")
                .phone("84999990000")
                .course("Tecnologia da Informação")
                .build());

        category = categoryRepository.save(Category.builder()
                .name("Aula Particular / Monitoria")
                .description("Reforço em disciplinas acadêmicas")
                .build());
    }

    @AfterEach
    void tearDown() {
        serviceListingRepository.deleteAll();
        categoryRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("Deve criar anúncio válido e exibi-lo na busca após publicado")
    void shouldCreateServiceListingAndShowInSearch() throws Exception {
        ServiceListingRequest request = ServiceListingRequest.builder()
                .title("Monitoria de Cálculo I e Vetores")
                .categoryName("Aula Particular / Monitoria")
                .description("Resolução de listas de exercícios e preparação para provas da ECT/UFRN.")
                .price(new BigDecimal("40.00"))
                .availability("Segundas e Quartas, 14h às 18h")
                .providerId(provider.getId())
                .build();

        mockMvc.perform(post("/listings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.title").value("Monitoria de Cálculo I e Vetores"))
                .andExpect(jsonPath("$.categoryName").value("Aula Particular / Monitoria"))
                .andExpect(jsonPath("$.price").value(40.00))
                .andExpect(jsonPath("$.availability").value("Segundas e Quartas, 14h às 18h"))
                .andExpect(jsonPath("$.providerName").value("Clóvis Araújo"));

        mockMvc.perform(get("/listings"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title").value("Monitoria de Cálculo I e Vetores"))
                .andExpect(jsonPath("$[0].categoryName").value("Aula Particular / Monitoria"))
                .andExpect(jsonPath("$[0].availability").value("Segundas e Quartas, 14h às 18h"));
    }

    @Test
    @DisplayName("Deve rejeitar criação de anúncio quando campos obrigatórios não forem preenchidos")
    void shouldRejectServiceListingWhenRequiredFieldsAreMissing() throws Exception {
        ServiceListingRequest missingDescription = ServiceListingRequest.builder()
                .title("Revisão de TCC")
                .categoryName("Revisão e Formatação de Texto")
                .description("")
                .price(new BigDecimal("50.00"))
                .availability("Finais de semana")
                .providerId(provider.getId())
                .build();

        mockMvc.perform(post("/listings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(missingDescription)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").exists());

        ServiceListingRequest missingCategory = ServiceListingRequest.builder()
                .title("Revisão de TCC")
                .categoryName("   ")
                .description("Revisão completa pelas normas da ABNT.")
                .price(new BigDecimal("50.00"))
                .availability("Finais de semana")
                .providerId(provider.getId())
                .build();

        mockMvc.perform(post("/listings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(missingCategory)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").exists());

        ServiceListingRequest negativePrice = ServiceListingRequest.builder()
                .title("Revisão de TCC")
                .categoryId(category.getId())
                .description("Revisão completa pelas normas da ABNT.")
                .price(new BigDecimal("-10.00"))
                .availability("Finais de semana")
                .providerId(provider.getId())
                .build();

        mockMvc.perform(post("/listings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(negativePrice)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").exists());
    }
}
