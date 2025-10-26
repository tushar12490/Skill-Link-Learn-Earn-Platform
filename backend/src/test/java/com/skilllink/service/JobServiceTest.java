package com.skilllink.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import com.skilllink.dto.JobDetailResponse;
import com.skilllink.model.Application;
import com.skilllink.model.ApplicationStatus;
import com.skilllink.model.Job;
import com.skilllink.model.JobStatus;
import com.skilllink.model.User;
import com.skilllink.model.UserRole;
import com.skilllink.repository.JobRepository;
import com.skilllink.repository.UserRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.NoSuchElementException;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class JobServiceTest {

    @Mock
    private JobRepository jobRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private JobService jobService;

    @Test
    void getJobWithApplications_returnsDetailsForOwner() {
        User client = new User();
        client.setId(10L);
        client.setRole(UserRole.CLIENT);

        User freelancer = new User();
        freelancer.setId(20L);
        freelancer.setRole(UserRole.FREELANCER);
        freelancer.setName("Taylor Freelance");

        Job job = new Job();
        job.setId(100L);
        job.setClient(client);
        job.setTitle("Build landing page");
        job.setDescription("Need a responsive site");
        job.setBudget(BigDecimal.valueOf(1200));
        job.setStatus(JobStatus.OPEN);

        Application older = new Application();
        older.setId(1L);
        older.setJob(job);
        older.setFreelancer(freelancer);
        older.setStatus(ApplicationStatus.APPLIED);
        older.setAppliedAt(LocalDateTime.now().minusDays(2));

        Application newer = new Application();
        newer.setId(2L);
        newer.setJob(job);
        newer.setFreelancer(freelancer);
        newer.setStatus(ApplicationStatus.APPLIED);
        newer.setAppliedAt(LocalDateTime.now().minusDays(1));

        job.getApplications().add(newer);
        job.getApplications().add(older);

        when(jobRepository.findWithApplicationsById(job.getId())).thenReturn(Optional.of(job));

        JobDetailResponse response = jobService.getJobWithApplications(job.getId(), client);

        assertThat(response.job()).isNotNull();
        assertThat(response.job().id()).isEqualTo(job.getId());
        assertThat(response.applications()).hasSize(2);
        assertThat(response.applications().get(0).id()).isEqualTo(older.getId());
        assertThat(response.applications().get(1).id()).isEqualTo(newer.getId());
    }

    @Test
    void getJobWithApplications_throwsForUnauthorizedUser() {
        User client = new User();
        client.setId(10L);
        client.setRole(UserRole.CLIENT);

        User otherClient = new User();
        otherClient.setId(99L);
        otherClient.setRole(UserRole.CLIENT);

        Job job = new Job();
        job.setId(100L);
        job.setClient(client);

        when(jobRepository.findWithApplicationsById(job.getId())).thenReturn(Optional.of(job));

        assertThatThrownBy(() -> jobService.getJobWithApplications(job.getId(), otherClient))
                .isInstanceOf(SecurityException.class)
                .hasMessageContaining("Cannot view details");
    }

    @Test
    void getJobWithApplications_throwsWhenJobMissing() {
        when(jobRepository.findWithApplicationsById(404L)).thenReturn(Optional.empty());

        User client = new User();
        client.setId(10L);
        client.setRole(UserRole.CLIENT);

        assertThatThrownBy(() -> jobService.getJobWithApplications(404L, client))
                .isInstanceOf(NoSuchElementException.class);
    }
}
