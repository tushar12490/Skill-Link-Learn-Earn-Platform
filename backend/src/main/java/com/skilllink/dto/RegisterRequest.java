package com.skilllink.dto;

import com.skilllink.model.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank String name,
        @Email @NotBlank String email,
        @Size(min = 6, message = "Password must be at least 6 characters") String password,
        UserRole role,
        String skills,
        String bio,
        Boolean isMentor
) {
}
