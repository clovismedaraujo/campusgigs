package com.campusgigs.validation;

import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

@Component
public class PasswordPolicyValidator {

    private static final int MIN_LENGTH = 8;
    private static final Pattern UPPERCASE_PATTERN = Pattern.compile("[A-Z]");
    private static final Pattern DIGIT_PATTERN = Pattern.compile("[0-9]");

    public boolean isValid(String password) {
        if (password == null || password.isBlank()) {
            return false;
        }
        String trimmed = password.trim();
        if (trimmed.length() < MIN_LENGTH) {
            return false;
        }
        return UPPERCASE_PATTERN.matcher(trimmed).find()
                && DIGIT_PATTERN.matcher(trimmed).find();
    }
}
