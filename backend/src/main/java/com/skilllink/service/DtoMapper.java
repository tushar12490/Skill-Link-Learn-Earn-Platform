package com.skilllink.service;

import com.skilllink.dto.ApplicationResponse;
import com.skilllink.dto.CourseResponse;
import com.skilllink.dto.JobResponse;
import com.skilllink.dto.UserResponse;
import com.skilllink.model.Application;
import com.skilllink.model.Course;
import com.skilllink.model.Job;
import com.skilllink.model.User;
import java.util.Optional;
import java.util.Set;

public final class DtoMapper {

    private DtoMapper() {
    }

    public static UserResponse toUserResponse(User user) {
        if (user == null) {
            return null;
        }
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getSkills(),
                user.getBio(),
                user.isMentor()
        );
    }

    public static JobResponse toJobResponse(Job job) {
        if (job == null) {
            return null;
        }
        return new JobResponse(
                job.getId(),
                job.getTitle(),
                job.getDescription(),
                job.getBudget(),
                job.getStatus(),
                job.getCreatedAt(),
                job.getRequiredSkills() == null ? Set.of() : Set.copyOf(job.getRequiredSkills()),
                Optional.ofNullable(job.getClient()).map(User::getId).orElse(null),
                Optional.ofNullable(job.getClient()).map(User::getName).orElse(null),
                Optional.ofNullable(job.getFreelancer()).map(User::getId).orElse(null),
                Optional.ofNullable(job.getFreelancer()).map(User::getName).orElse(null)
        );
    }

    public static ApplicationResponse toApplicationResponse(Application application) {
        if (application == null) {
            return null;
        }
        Job job = application.getJob();
        User freelancer = application.getFreelancer();
        User client = job != null ? job.getClient() : null;
        return new ApplicationResponse(
                application.getId(),
                job != null ? job.getId() : null,
                job != null ? job.getTitle() : null,
                application.getStatus(),
                application.getAppliedAt(),
                freelancer != null ? freelancer.getId() : null,
                freelancer != null ? freelancer.getName() : null,
                client != null ? client.getId() : null,
                client != null ? client.getName() : null
        );
    }

    public static CourseResponse toCourseResponse(Course course) {
        if (course == null) {
            return null;
        }
        User mentor = course.getMentor();
        return new CourseResponse(
                course.getId(),
                course.getTitle(),
                course.getDescription(),
                course.getVideoUrl(),
                course.getPrice(),
                course.getCreatedAt(),
                mentor != null ? mentor.getId() : null,
                mentor != null ? mentor.getName() : null
        );
    }
}
