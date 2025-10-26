package com.skilllink.dto;

import java.time.LocalDateTime;

public record EnrollmentResponse(
        Long id,
        Long courseId,
        Long learnerId,
        LocalDateTime enrolledAt
) {
}
