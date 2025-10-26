package com.skilllink.repository;

import com.skilllink.model.Enrollment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    boolean existsByCourseIdAndLearnerId(Long courseId, Long learnerId);
    List<Enrollment> findByLearnerId(Long learnerId);
}
