package com.skilllink.controller;

import com.skilllink.dto.CourseRequest;
import com.skilllink.dto.CourseResponse;
import com.skilllink.dto.EnrollmentResponse;
import com.skilllink.model.User;
import com.skilllink.service.CourseService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @PostMapping
    public ResponseEntity<CourseResponse> createCourse(@Valid @RequestBody CourseRequest request,
                                                       @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(courseService.createCourse(request, user));
    }

    @GetMapping
    public ResponseEntity<List<CourseResponse>> getCourses() {
        return ResponseEntity.ok(courseService.getCourses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseResponse> getCourse(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getCourse(id));
    }

    @PostMapping("/{id}/enroll")
    public ResponseEntity<EnrollmentResponse> enroll(@PathVariable Long id,
                                                     @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(courseService.enroll(id, user));
    }
}
