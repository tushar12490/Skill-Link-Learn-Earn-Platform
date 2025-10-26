package com.skilllink.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.util.Set;

public record JobRequest(
        @NotBlank String title,
        @NotBlank String description,
        @NotNull @Positive BigDecimal budget,
        Set<String> skills
) {
}
