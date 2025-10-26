package com.skilllink.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @JsonIgnore
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "is_mentor")
    private boolean isMentor;

    @JsonIgnore
    @OneToMany(mappedBy = "client")
    private Set<Job> postedJobs = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "freelancer")
    private Set<Job> assignedJobs = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "mentor")
    private Set<Course> mentorCourses = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "learner")
    private Set<Enrollment> enrollments = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "freelancer")
    private Set<Application> applications = new HashSet<>();

    public User() {
    }

    public User(Long id, String name, String email, String password, UserRole role, String skills, String bio, boolean isMentor) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.skills = skills;
        this.bio = bio;
        this.isMentor = isMentor;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public boolean isMentor() {
        return isMentor;
    }

    public void setMentor(boolean mentor) {
        isMentor = mentor;
    }

    public Set<Job> getPostedJobs() {
        return postedJobs;
    }

    public void setPostedJobs(Set<Job> postedJobs) {
        this.postedJobs = postedJobs;
    }

    public Set<Job> getAssignedJobs() {
        return assignedJobs;
    }

    public void setAssignedJobs(Set<Job> assignedJobs) {
        this.assignedJobs = assignedJobs;
    }

    public Set<Course> getMentorCourses() {
        return mentorCourses;
    }

    public void setMentorCourses(Set<Course> mentorCourses) {
        this.mentorCourses = mentorCourses;
    }

    public Set<Enrollment> getEnrollments() {
        return enrollments;
    }

    public void setEnrollments(Set<Enrollment> enrollments) {
        this.enrollments = enrollments;
    }

    public Set<Application> getApplications() {
        return applications;
    }

    public void setApplications(Set<Application> applications) {
        this.applications = applications;
    }

    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    @JsonIgnore
    public String getUsername() {
        return email;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isEnabled() {
        return true;
    }
}
