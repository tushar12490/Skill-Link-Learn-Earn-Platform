package com.skilllink.repository;

import com.skilllink.model.Job;
import com.skilllink.model.JobStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByClientId(Long clientId);
    List<Job> findByFreelancerId(Long freelancerId);
    List<Job> findByStatus(JobStatus status);

    @EntityGraph(attributePaths = {"client", "freelancer", "applications", "applications.freelancer"})
    Optional<Job> findWithApplicationsById(Long id);
}
