package com.campusgigs.controller;

import com.campusgigs.dto.UserRegistrationRequest;
import com.campusgigs.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("Deve cadastrar estudante com domínio institucional da UFRN válido")
    void shouldRegisterUserWithValidUfrnEmail() throws Exception {
        UserRegistrationRequest request = UserRegistrationRequest.builder()
                .name("Clóvis Araújo")
                .institutionalEmail("clovis.araujo@ufrn.edu.br")
                .phone("84999990000")
                .course("Tecnologia da Informação")
                .build();

        mockMvc.perform(post("/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.name").value("Clóvis Araújo"))
                .andExpect(jsonPath("$.institutionalEmail").value("clovis.araujo@ufrn.edu.br"))
                .andExpect(jsonPath("$.course").value("Tecnologia da Informação"));
    }

    @Test
    @DisplayName("Deve rejeitar cadastro quando o e-mail não pertence a um domínio universitário aprovado")
    void shouldRejectRegistrationWithUnauthorizedEmailDomain() throws Exception {
        UserRegistrationRequest request = UserRegistrationRequest.builder()
                .name("João Silva")
                .institutionalEmail("joao.silva@gmail.com")
                .phone("84988887777")
                .course("Ciência da Computação")
                .build();

        mockMvc.perform(post("/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    @DisplayName("Deve rejeitar cadastro quando o e-mail institucional já estiver em uso")
    void shouldRejectDuplicateInstitutionalEmail() throws Exception {
        UserRegistrationRequest request = UserRegistrationRequest.builder()
                .name("Maria Souza")
                .institutionalEmail("maria@escolar.ufrn.br")
                .phone("84977776666")
                .course("Engenharia de Software")
                .build();

        mockMvc.perform(post("/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").exists());
    }
}
