package com.skilllink.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;

public record CourseRequest(
        @NotBlank String title,
        @NotBlank String description,
        String videoUrl,
        @NotNull @PositiveOrZero BigDecimal price
) {
}
