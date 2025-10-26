package com.skilllink.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum UserRole {
    CLIENT,
    FREELANCER,
    LEARNER;

    @JsonCreator(mode = JsonCreator.Mode.DELEGATING)
    public static UserRole fromValue(Object value) {
        if (value == null) {
            return LEARNER;
        }

        String text = value.toString().trim();
        if (text.isEmpty()) {
            return LEARNER;
        }

        try {
            return UserRole.valueOf(text.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Unsupported role: " + text);
        }
    }

    @JsonValue
    public String toValue() {
        return name();
    }
}
