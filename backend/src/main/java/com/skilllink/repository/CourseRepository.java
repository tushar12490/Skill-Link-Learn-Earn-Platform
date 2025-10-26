package com.skilllink.repository;

import com.skilllink.model.Course;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByMentorId(Long mentorId);
}
