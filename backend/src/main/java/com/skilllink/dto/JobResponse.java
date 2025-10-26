package com.skilllink.dto;

import com.skilllink.model.JobStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

public record JobResponse(
        Long id,
        String title,
        String description,
        BigDecimal budget,
        JobStatus status,
        LocalDateTime createdAt,
        Set<String> requiredSkills,
        Long clientId,
        String clientName,
        Long freelancerId,
        String freelancerName
) {
}
