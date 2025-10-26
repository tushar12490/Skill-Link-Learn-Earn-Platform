package com.skilllink.service;

import com.skilllink.dto.CourseRequest;
import com.skilllink.dto.CourseResponse;
import com.skilllink.dto.EnrollmentResponse;
import com.skilllink.model.Course;
import com.skilllink.model.Enrollment;
import com.skilllink.model.User;
import com.skilllink.model.UserRole;
import com.skilllink.repository.CourseRepository;
import com.skilllink.repository.EnrollmentRepository;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;

    public CourseService(CourseRepository courseRepository, EnrollmentRepository enrollmentRepository) {
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    @Transactional
    public CourseResponse createCourse(CourseRequest request, User mentor) {
        if (mentor.getRole() != UserRole.FREELANCER) {
            throw new SecurityException("Only mentors/freelancers can create courses");
        }
        Course course = new Course();
        course.setTitle(request.title());
        course.setDescription(request.description());
        course.setVideoUrl(request.videoUrl());
        course.setPrice(request.price());
        course.setMentor(mentor);
        Course saved = courseRepository.save(course);
        return DtoMapper.toCourseResponse(saved);
    }

    public List<CourseResponse> getCourses() {
        return courseRepository.findAll().stream()
                .map(DtoMapper::toCourseResponse)
                .collect(Collectors.toList());
    }

    public CourseResponse getCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Course not found"));
        return DtoMapper.toCourseResponse(course);
    }

    @Transactional
    public EnrollmentResponse enroll(Long courseId, User learner) {
        if (learner.getRole() != UserRole.LEARNER) {
            throw new SecurityException("Only learners can enroll in courses");
        }
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new NoSuchElementException("Course not found"));
        if (enrollmentRepository.existsByCourseIdAndLearnerId(courseId, learner.getId())) {
            throw new IllegalStateException("Already enrolled");
        }
        Enrollment enrollment = new Enrollment();
        enrollment.setCourse(course);
        enrollment.setLearner(learner);
        Enrollment saved = enrollmentRepository.save(enrollment);
        return new EnrollmentResponse(saved.getId(), course.getId(), learner.getId(), saved.getEnrolledAt());
    }
}
