package com.campusgigs.validation;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class InstitutionalEmailValidator {

    private final Set<String> approvedDomains;

    public InstitutionalEmailValidator(
            @Value("${campusgigs.security.approved-domains:ufrn.edu.br,escolar.ufrn.br,ufrn.br,imd.ufrn.br,dca.ufrn.br}")
            List<String> approvedDomains) {
        this.approvedDomains = approvedDomains.stream()
                .map(domain -> domain.trim().toLowerCase(Locale.ROOT))
                .filter(domain -> !domain.isEmpty())
                .collect(Collectors.toUnmodifiableSet());
    }

    public boolean isApprovedDomain(String email) {
        if (email == null || email.isBlank()) {
            return false;
        }

        String trimmed = email.trim().toLowerCase(Locale.ROOT);
        int atIndex = trimmed.lastIndexOf('@');
        if (atIndex <= 0 || atIndex == trimmed.length() - 1) {
            return false;
        }

        String domain = trimmed.substring(atIndex + 1);
        return approvedDomains.contains(domain);
    }

    public Set<String> getApprovedDomains() {
        return approvedDomains;
    }
}
