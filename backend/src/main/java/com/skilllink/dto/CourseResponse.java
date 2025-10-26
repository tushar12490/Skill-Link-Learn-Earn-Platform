package com.skilllink.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CourseResponse(
        Long id,
        String title,
        String description,
        String videoUrl,
        BigDecimal price,
        LocalDateTime createdAt,
        Long mentorId,
        String mentorName
) {
}
