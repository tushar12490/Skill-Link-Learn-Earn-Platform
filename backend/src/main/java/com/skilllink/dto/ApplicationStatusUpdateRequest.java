package com.skilllink.dto;

import com.skilllink.model.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

public record ApplicationStatusUpdateRequest(@NotNull ApplicationStatus status) {
}
