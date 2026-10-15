package com.campusgigs.validation;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class InstitutionalEmailValidatorTest {

    private InstitutionalEmailValidator validator;

    @BeforeEach
    void setUp() {
        validator = new InstitutionalEmailValidator(List.of(
                "ufrn.edu.br",
                "escolar.ufrn.br",
                "ufrn.br",
                "imd.ufrn.br"
        ));
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "clovis@ufrn.edu.br",
            "maria.silva@escolar.ufrn.br",
            "joao@ufrn.br",
            "dev@imd.ufrn.br",
            "ESTUDANTE@UFRN.EDU.BR"
    })
    @DisplayName("Deve aceitar e-mails com domínios institucionais aprovados da UFRN")
    void shouldAcceptApprovedInstitutionalDomains(String email) {
        assertThat(validator.isApprovedDomain(email)).isTrue();
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "estudante@gmail.com",
            "estudante@hotmail.com",
            "estudante@outlook.com",
            "estudante@usp.br",
            "estudante@falso-ufrn.edu.br",
            "estudante@ufrn.edu.br.malicious.com"
    })
    @DisplayName("Deve rejeitar e-mails com domínios não autorizados")
    void shouldRejectUnauthorizedDomains(String email) {
        assertThat(validator.isApprovedDomain(email)).isFalse();
    }

    @Test
    @DisplayName("Deve rejeitar e-mails nulos, vazios ou mal formatados")
    void shouldRejectNullEmptyOrMalformedEmails() {
        assertThat(validator.isApprovedDomain(null)).isFalse();
        assertThat(validator.isApprovedDomain("")).isFalse();
        assertThat(validator.isApprovedDomain("   ")).isFalse();
        assertThat(validator.isApprovedDomain("sem-arroba.ufrn.edu.br")).isFalse();
        assertThat(validator.isApprovedDomain("usuario@")).isFalse();
    }
}
