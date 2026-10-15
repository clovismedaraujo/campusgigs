package com.campusgigs.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRegistrationRequest {

    @NotBlank(message = "O nome é obrigatório")
    private String name;

    @NotBlank(message = "O e-mail institucional é obrigatório")
    @Email(message = "Formato de e-mail inválido")
    private String institutionalEmail;

    private String phone;

    private String course;
}
