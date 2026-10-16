package com.campusgigs.controller;

import com.campusgigs.dto.UserLoginRequest;
import com.campusgigs.dto.UserRegistrationRequest;
import com.campusgigs.model.User;
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

import static org.assertj.core.api.Assertions.assertThat;
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
    @DisplayName("Deve cadastrar estudante com domínio institucional da UFRN válido e encriptar a senha")
    void shouldRegisterUserWithValidUfrnEmailAndEncryptedPassword() throws Exception {
        UserRegistrationRequest request = UserRegistrationRequest.builder()
                .name("Clóvis Araújo")
                .institutionalEmail("clovis.araujo@ufrn.edu.br")
                .password("Campus2026")
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
                .andExpect(jsonPath("$.course").value("Tecnologia da Informação"))
                .andExpect(jsonPath("$.password").doesNotExist());

        User savedUser = userRepository.findByInstitutionalEmail("clovis.araujo@ufrn.edu.br").orElseThrow();
        assertThat(savedUser.getPassword()).isNotEqualTo("Campus2026");
        assertThat(savedUser.getPassword()).startsWith("$2a$");
    }

    @Test
    @DisplayName("Deve rejeitar cadastro quando o e-mail não pertence a um domínio universitário aprovado")
    void shouldRejectRegistrationWithUnauthorizedEmailDomain() throws Exception {
        UserRegistrationRequest request = UserRegistrationRequest.builder()
                .name("João Silva")
                .institutionalEmail("joao.silva@gmail.com")
                .password("Campus2026")
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
    @DisplayName("Deve rejeitar cadastro quando a senha não cumpre os requisitos mínimos de complexidade")
    void shouldRejectRegistrationWithWeakPassword() throws Exception {
        UserRegistrationRequest request = UserRegistrationRequest.builder()
                .name("Ana Beatriz")
                .institutionalEmail("ana.beatriz@ufrn.edu.br")
                .password("fraca123")
                .phone("84988881111")
                .course("Engenharia de Software")
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
                .password("Campus2026")
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

    @Test
    @DisplayName("Deve autenticar estudante com e-mail institucional e senha corretos")
    void shouldLoginRegisteredStudentSuccessfully() throws Exception {
        UserRegistrationRequest registerRequest = UserRegistrationRequest.builder()
                .name("Pedro Henrique")
                .institutionalEmail("pedro@ufrn.edu.br")
                .password("Campus2026")
                .phone("84999991111")
                .course("Ciência da Computação")
                .build();

        mockMvc.perform(post("/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated());

        UserLoginRequest loginRequest = UserLoginRequest.builder()
                .institutionalEmail("pedro@ufrn.edu.br")
                .password("Campus2026")
                .build();

        mockMvc.perform(post("/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.institutionalEmail").value("pedro@ufrn.edu.br"))
                .andExpect(jsonPath("$.name").value("Pedro Henrique"));
    }
}
