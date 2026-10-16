package com.campusgigs.validation;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;

class PasswordPolicyValidatorTest {

    private PasswordPolicyValidator validator;

    @BeforeEach
    void setUp() {
        validator = new PasswordPolicyValidator();
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "Campus2026",
            "SenhaForte1",
            "Ufrn@2026A",
            "Abcdefg1"
    })
    @DisplayName("Deve aprovar senhas que atendem aos requisitos mínimos (8+ caracteres, maiúscula e número)")
    void shouldAcceptValidPasswords(String password) {
        assertThat(validator.isValid(password)).isTrue();
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "Curta1",          // menos de 8 caracteres
            "semmaiuscula123", // sem letra maiúscula
            "SemNumeroAqui",   // sem número
            "12345678",        // apenas números, sem letra maiúscula
            "        1A"       // espaços ou inválida
    })
    @DisplayName("Deve rejeitar senhas que não cumprem a política de complexidade")
    void shouldRejectWeakPasswords(String password) {
        assertThat(validator.isValid(password)).isFalse();
    }

    @Test
    @DisplayName("Deve rejeitar senhas nulas ou vazias")
    void shouldRejectNullOrEmptyPasswords() {
        assertThat(validator.isValid(null)).isFalse();
        assertThat(validator.isValid("")).isFalse();
        assertThat(validator.isValid("   ")).isFalse();
    }
}
