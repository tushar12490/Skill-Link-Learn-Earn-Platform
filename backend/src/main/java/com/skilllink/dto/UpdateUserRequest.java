package com.skilllink.dto;

public record UpdateUserRequest(
        String name,
        String bio,
        String skills,
        Boolean isMentor
) {
}
