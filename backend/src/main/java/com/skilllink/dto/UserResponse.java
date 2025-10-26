package com.skilllink.dto;

import com.skilllink.model.UserRole;

public record UserResponse(
        Long id,
        String name,
        String email,
        UserRole role,
        String skills,
        String bio,
        boolean isMentor
) {
}
