package com.skilllink.dto;

import java.util.List;

public record JobDetailResponse(
        JobResponse job,
        List<ApplicationResponse> applications
) {
}