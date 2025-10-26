package com.skilllink.repository;

import com.skilllink.model.Application;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByFreelancerId(Long freelancerId);
    List<Application> findByJobId(Long jobId);
    boolean existsByJobIdAndFreelancerId(Long jobId, Long freelancerId);
}
