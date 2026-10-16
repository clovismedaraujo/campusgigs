package com.campusgigs.service;

import com.campusgigs.dto.UserLoginRequest;
import com.campusgigs.dto.UserRegistrationRequest;
import com.campusgigs.dto.UserResponse;
import com.campusgigs.exception.DuplicateEmailException;
import com.campusgigs.exception.InvalidCredentialsException;
import com.campusgigs.exception.InvalidInstitutionalDomainException;
import com.campusgigs.exception.WeakPasswordException;
import com.campusgigs.model.User;
import com.campusgigs.repository.UserRepository;
import com.campusgigs.validation.InstitutionalEmailValidator;
import com.campusgigs.validation.PasswordPolicyValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final InstitutionalEmailValidator institutionalEmailValidator;
    private final PasswordPolicyValidator passwordPolicyValidator;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserResponse registerUser(UserRegistrationRequest request) {
        String normalizedEmail = request.getInstitutionalEmail().trim().toLowerCase(Locale.ROOT);

        if (!institutionalEmailValidator.isApprovedDomain(normalizedEmail)) {
            throw new InvalidInstitutionalDomainException(
                    "Domínio de e-mail não autorizado. Utilize um e-mail institucional aprovado da UFRN."
            );
        }

        if (!passwordPolicyValidator.isValid(request.getPassword())) {
            throw new WeakPasswordException(
                    "A senha deve ter no mínimo 8 caracteres, incluir pelo menos uma letra maiúscula e um número."
            );
        }

        if (userRepository.existsByInstitutionalEmail(normalizedEmail)) {
            throw new DuplicateEmailException("Este e-mail institucional já está cadastrado.");
        }

        String encryptedPassword = passwordEncoder.encode(request.getPassword());

        User user = User.builder()
                .name(request.getName().trim())
                .institutionalEmail(normalizedEmail)
                .password(encryptedPassword)
                .phone(request.getPhone())
                .course(request.getCourse())
                .build();

        User savedUser = userRepository.save(user);
        return UserResponse.fromEntity(savedUser);
    }

    @Transactional(readOnly = true)
    public UserResponse loginUser(UserLoginRequest request) {
        String normalizedEmail = request.getInstitutionalEmail().trim().toLowerCase(Locale.ROOT);

        User user = userRepository.findByInstitutionalEmail(normalizedEmail)
                .orElseThrow(() -> new InvalidCredentialsException("E-mail institucional ou senha inválidos."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("E-mail institucional ou senha inválidos.");
        }

        return UserResponse.fromEntity(user);
    }
}
