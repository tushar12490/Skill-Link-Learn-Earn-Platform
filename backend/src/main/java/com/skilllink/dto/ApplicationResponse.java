package com.skilllink.dto;

import com.skilllink.model.ApplicationStatus;
import java.time.LocalDateTime;

public record ApplicationResponse(
        Long id,
        Long jobId,
        String jobTitle,
        ApplicationStatus status,
        LocalDateTime appliedAt,
        Long freelancerId,
        String freelancerName,
        Long clientId,
        String clientName
) {
}
