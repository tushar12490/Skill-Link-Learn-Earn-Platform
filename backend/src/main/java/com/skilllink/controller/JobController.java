package com.skilllink.controller;

import com.skilllink.dto.AssignFreelancerRequest;
import com.skilllink.dto.JobDetailResponse;
import com.skilllink.dto.JobRequest;
import com.skilllink.dto.JobResponse;
import com.skilllink.model.User;
import com.skilllink.model.UserRole;
import com.skilllink.service.JobService;
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
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping
    public ResponseEntity<JobResponse> createJob(@Valid @RequestBody JobRequest request,
                                                 @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(jobService.createJob(request, user));
    }

    @GetMapping
    public ResponseEntity<List<JobResponse>> getJobs() {
        return ResponseEntity.ok(jobService.getJobs());
    }

    @GetMapping("/client")
    public ResponseEntity<List<JobResponse>> getJobsForClient(@AuthenticationPrincipal User user) {
        if (user.getRole() != UserRole.CLIENT) {
            throw new SecurityException("Only clients can view their posted jobs");
        }
        return ResponseEntity.ok(jobService.getJobsForClient(user));
    }

    @GetMapping("/freelancer")
    public ResponseEntity<List<JobResponse>> getJobsForFreelancer(@AuthenticationPrincipal User user) {
        if (user.getRole() != UserRole.FREELANCER) {
            throw new SecurityException("Only freelancers can view assigned jobs");
        }
        return ResponseEntity.ok(jobService.getJobsForFreelancer(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getJob(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJob(id));
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<JobDetailResponse> getJobWithApplications(@PathVariable Long id,
                                                                    @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(jobService.getJobWithApplications(id, user));
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<JobResponse> assignFreelancer(@PathVariable Long id,
                                                        @Valid @RequestBody AssignFreelancerRequest request,
                                                        @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(jobService.assignFreelancer(id, request, user));
    }
}
