package com.skilllink.service;

import com.skilllink.dto.ApplicationRequest;
import com.skilllink.dto.ApplicationResponse;
import com.skilllink.model.Application;
import com.skilllink.model.ApplicationStatus;
import com.skilllink.model.Job;
import com.skilllink.model.JobStatus;
import com.skilllink.model.User;
import com.skilllink.model.UserRole;
import com.skilllink.repository.ApplicationRepository;
import com.skilllink.repository.JobRepository;
import java.util.Comparator;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;

    public ApplicationService(ApplicationRepository applicationRepository, JobRepository jobRepository) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
    }

    @Transactional
    public ApplicationResponse apply(ApplicationRequest request, User freelancer) {
        if (freelancer.getRole() != UserRole.FREELANCER) {
            throw new SecurityException("Only freelancers can apply to jobs");
        }

        Job job = jobRepository.findById(request.jobId())
                .orElseThrow(() -> new NoSuchElementException("Job not found"));

        if (job.getStatus() != JobStatus.OPEN) {
            throw new IllegalStateException("Cannot apply to closed job");
        }

        if (applicationRepository.existsByJobIdAndFreelancerId(job.getId(), freelancer.getId())) {
            throw new IllegalStateException("You have already applied to this job");
        }

        Application application = new Application();
        application.setJob(job);
        application.setFreelancer(freelancer);
        application.setStatus(ApplicationStatus.APPLIED);
        Application saved = applicationRepository.save(application);
        return DtoMapper.toApplicationResponse(saved);
    }

    public List<ApplicationResponse> getForFreelancer(User freelancer) {
        return applicationRepository.findByFreelancerId(freelancer.getId()).stream()
                .map(DtoMapper::toApplicationResponse)
                .collect(Collectors.toList());
    }

    public List<ApplicationResponse> getForJob(Long jobId, User requester) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new NoSuchElementException("Job not found"));

        if (job.getClient() == null || !job.getClient().getId().equals(requester.getId())) {
            throw new SecurityException("Cannot view applications for this job");
        }

        return applicationRepository.findByJobId(jobId).stream()
                .sorted(Comparator.comparing(Application::getAppliedAt))
                .map(DtoMapper::toApplicationResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApplicationResponse updateStatus(Long applicationId, ApplicationStatus status, User requester) {
        if (status == null) {
            throw new IllegalArgumentException("Status is required");
        }

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new NoSuchElementException("Application not found"));

        Job job = application.getJob();
        if (job == null) {
            throw new IllegalStateException("Application is not associated with a job");
        }

        if (job.getClient() == null || !job.getClient().getId().equals(requester.getId())) {
            throw new SecurityException("Cannot modify applications for this job");
        }

        if (application.getStatus() == status) {
            return DtoMapper.toApplicationResponse(application);
        }

        if (application.getStatus() != ApplicationStatus.APPLIED) {
            throw new IllegalStateException("Application has already been processed");
        }

        switch (status) {
            case ACCEPTED -> handleAcceptance(application, job);
            case REJECTED -> application.setStatus(ApplicationStatus.REJECTED);
            case APPLIED -> throw new IllegalArgumentException("Cannot revert application to APPLIED");
            default -> throw new IllegalArgumentException("Unsupported status: " + status);
        }

        return DtoMapper.toApplicationResponse(application);
    }

    private void handleAcceptance(Application application, Job job) {
        if (job.getStatus() != JobStatus.OPEN) {
            throw new IllegalStateException("Job is not open for assignment");
        }

        job.setFreelancer(application.getFreelancer());
        job.setStatus(JobStatus.IN_PROGRESS);
        application.setStatus(ApplicationStatus.ACCEPTED);

        applicationRepository.findByJobId(job.getId()).stream()
                .filter(other -> !other.getId().equals(application.getId()))
                .filter(other -> other.getStatus() == ApplicationStatus.APPLIED)
                .forEach(other -> other.setStatus(ApplicationStatus.REJECTED));
    }
}
