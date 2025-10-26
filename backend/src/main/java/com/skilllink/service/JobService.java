package com.skilllink.service;

import com.skilllink.dto.AssignFreelancerRequest;
import com.skilllink.dto.JobDetailResponse;
import com.skilllink.dto.JobRequest;
import com.skilllink.dto.JobResponse;
import com.skilllink.model.Job;
import com.skilllink.model.JobStatus;
import com.skilllink.model.User;
import com.skilllink.model.UserRole;
import com.skilllink.repository.JobRepository;
import com.skilllink.repository.UserRepository;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public JobService(JobRepository jobRepository, UserRepository userRepository) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public JobResponse createJob(JobRequest request, User client) {
        if (client.getRole() != UserRole.CLIENT) {
            throw new SecurityException("Only clients can post jobs");
        }
        Job job = new Job();
        job.setTitle(request.title());
        job.setDescription(request.description());
        job.setBudget(request.budget());
        if (request.skills() != null) {
            job.setRequiredSkills(new HashSet<>(request.skills()));
        }
        job.setClient(client);
        job.setStatus(JobStatus.OPEN);
        Job saved = jobRepository.save(job);
        return DtoMapper.toJobResponse(saved);
    }

    public List<JobResponse> getJobs() {
        return jobRepository.findAll().stream()
                .map(DtoMapper::toJobResponse)
                .collect(Collectors.toList());
    }

    public JobResponse getJob(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Job not found"));
        return DtoMapper.toJobResponse(job);
    }

    @Transactional
    public JobResponse assignFreelancer(Long jobId, AssignFreelancerRequest request, User client) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new NoSuchElementException("Job not found"));
        if (!job.getClient().getId().equals(client.getId())) {
            throw new SecurityException("Cannot assign freelancer to someone else's job");
        }
        User freelancer = userRepository.findById(request.freelancerId())
                .orElseThrow(() -> new NoSuchElementException("Freelancer not found"));
        if (freelancer.getRole() != UserRole.FREELANCER) {
            throw new IllegalArgumentException("Selected user is not a freelancer");
        }
        job.setFreelancer(freelancer);
        job.setStatus(JobStatus.IN_PROGRESS);
        return DtoMapper.toJobResponse(job);
    }

    public List<JobResponse> getJobsForClient(User client) {
        return jobRepository.findByClientId(client.getId()).stream()
                .map(DtoMapper::toJobResponse)
                .collect(Collectors.toList());
    }

    public List<JobResponse> getJobsForFreelancer(User freelancer) {
        return jobRepository.findByFreelancerId(freelancer.getId()).stream()
                .map(DtoMapper::toJobResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public JobDetailResponse getJobWithApplications(Long jobId, User requester) {
        Job job = jobRepository.findWithApplicationsById(jobId)
                .orElseThrow(() -> new NoSuchElementException("Job not found"));

        if (job.getClient() == null || !job.getClient().getId().equals(requester.getId())) {
            throw new SecurityException("Cannot view details for this job");
        }

        List<com.skilllink.model.Application> applications = job.getApplications().stream()
                .sorted(Comparator.comparing(com.skilllink.model.Application::getAppliedAt))
                .collect(Collectors.toList());

        return new JobDetailResponse(
                DtoMapper.toJobResponse(job),
                applications.stream().map(DtoMapper::toApplicationResponse).collect(Collectors.toList())
        );
    }
}
