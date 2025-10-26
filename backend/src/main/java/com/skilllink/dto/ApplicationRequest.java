package com.skilllink.dto;

import jakarta.validation.constraints.NotNull;

public record ApplicationRequest(@NotNull Long jobId) {
}
