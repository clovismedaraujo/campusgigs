package com.campusgigs.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserLoginRequest {

    @NotBlank(message = "O e-mail institucional é obrigatório")
    @Email(message = "Formato de e-mail inválido")
    private String institutionalEmail;

    @NotBlank(message = "A senha é obrigatória")
    private String password;
}
