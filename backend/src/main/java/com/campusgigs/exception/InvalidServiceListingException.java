package com.campusgigs.exception;

public class InvalidServiceListingException extends RuntimeException {
    public InvalidServiceListingException(String message) {
        super(message);
    }
}
