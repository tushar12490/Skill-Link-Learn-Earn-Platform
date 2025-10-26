package com.skilllink.controller;

import com.skilllink.dto.ApplicationRequest;
import com.skilllink.dto.ApplicationResponse;
import com.skilllink.dto.ApplicationStatusUpdateRequest;
import com.skilllink.model.User;
import com.skilllink.service.ApplicationService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public ResponseEntity<ApplicationResponse> apply(@Valid @RequestBody ApplicationRequest request,
                                                     @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(applicationService.apply(request, user));
    }

    @GetMapping("/freelancer/{id}")
    public ResponseEntity<List<ApplicationResponse>> getForFreelancer(@PathVariable Long id,
                                                                      @AuthenticationPrincipal User user) {
        if (!user.getId().equals(id)) {
            throw new SecurityException("Cannot view another freelancer's applications");
        }
        return ResponseEntity.ok(applicationService.getForFreelancer(user));
    }

    @GetMapping("/job/{id}")
    public ResponseEntity<List<ApplicationResponse>> getForJob(@PathVariable Long id,
                                                               @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(applicationService.getForJob(id, user));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApplicationResponse> updateStatus(@PathVariable Long id,
                                                             @Valid @RequestBody ApplicationStatusUpdateRequest request,
                                                             @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(applicationService.updateStatus(id, request.status(), user));
    }
}
