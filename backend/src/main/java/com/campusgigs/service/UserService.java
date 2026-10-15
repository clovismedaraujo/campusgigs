package com.campusgigs.service;

import com.campusgigs.dto.UserRegistrationRequest;
import com.campusgigs.dto.UserResponse;
import com.campusgigs.exception.DuplicateEmailException;
import com.campusgigs.exception.InvalidInstitutionalDomainException;
import com.campusgigs.model.User;
import com.campusgigs.repository.UserRepository;
import com.campusgigs.validation.InstitutionalEmailValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final InstitutionalEmailValidator institutionalEmailValidator;

    @Transactional
    public UserResponse registerUser(UserRegistrationRequest request) {
        String normalizedEmail = request.getInstitutionalEmail().trim().toLowerCase(Locale.ROOT);

        if (!institutionalEmailValidator.isApprovedDomain(normalizedEmail)) {
            throw new InvalidInstitutionalDomainException(
                    "Domínio de e-mail não autorizado. Utilize um e-mail institucional aprovado da UFRN."
            );
        }

        if (userRepository.existsByInstitutionalEmail(normalizedEmail)) {
            throw new DuplicateEmailException("Este e-mail institucional já está cadastrado.");
        }

        User user = User.builder()
                .name(request.getName().trim())
                .institutionalEmail(normalizedEmail)
                .phone(request.getPhone())
                .course(request.getCourse())
                .build();

        User savedUser = userRepository.save(user);
        return UserResponse.fromEntity(savedUser);
    }
}
