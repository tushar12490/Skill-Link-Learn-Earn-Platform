package com.skilllink.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.skilllink.dto.ApplicationResponse;
import com.skilllink.model.Application;
import com.skilllink.model.ApplicationStatus;
import com.skilllink.model.Job;
import com.skilllink.model.JobStatus;
import com.skilllink.model.User;
import com.skilllink.model.UserRole;
import com.skilllink.repository.ApplicationRepository;
import com.skilllink.repository.JobRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ApplicationServiceTest {

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private JobRepository jobRepository;

    @InjectMocks
    private ApplicationService applicationService;

    @Test
    void getForJob_returnsApplicationsForOwner() {
        User client = new User();
        client.setId(42L);
        client.setRole(UserRole.CLIENT);

        Job job = new Job();
        job.setId(100L);
        job.setClient(client);
        job.setStatus(JobStatus.OPEN);

        User freelancer = new User();
        freelancer.setId(77L);
        freelancer.setName("Freelancer One");

        Application application = new Application();
        application.setId(5L);
        application.setJob(job);
        application.setFreelancer(freelancer);
        application.setStatus(ApplicationStatus.APPLIED);
        application.setAppliedAt(LocalDateTime.now().minusDays(1));

        when(jobRepository.findById(job.getId())).thenReturn(Optional.of(job));
        when(applicationRepository.findByJobId(job.getId())).thenReturn(List.of(application));

        List<ApplicationResponse> responses = applicationService.getForJob(job.getId(), client);

        assertThat(responses).hasSize(1);
        ApplicationResponse response = responses.get(0);
        assertThat(response.jobId()).isEqualTo(job.getId());
        assertThat(response.freelancerId()).isEqualTo(freelancer.getId());
        assertThat(response.status()).isEqualTo(ApplicationStatus.APPLIED);

        verify(jobRepository).findById(job.getId());
        verify(applicationRepository).findByJobId(job.getId());
    }

    @Test
    void getForJob_throwsWhenRequesterNotOwner() {
        User client = new User();
        client.setId(42L);
        client.setRole(UserRole.CLIENT);

        Job job = new Job();
        job.setId(100L);
        job.setClient(client);
        job.setStatus(JobStatus.OPEN);

        User otherClient = new User();
        otherClient.setId(99L);
        otherClient.setRole(UserRole.CLIENT);

        when(jobRepository.findById(job.getId())).thenReturn(Optional.of(job));

        assertThatThrownBy(() -> applicationService.getForJob(job.getId(), otherClient))
                .isInstanceOf(SecurityException.class)
                .hasMessageContaining("Cannot view applications");

        verify(applicationRepository, never()).findByJobId(job.getId());
    }

    @Test
    void updateStatus_acceptsProposalAndAssignsJob() {
        User client = new User();
        client.setId(42L);
        client.setRole(UserRole.CLIENT);

        Job job = new Job();
        job.setId(100L);
        job.setClient(client);
        job.setStatus(JobStatus.OPEN);

        User freelancer = new User();
        freelancer.setId(77L);
        freelancer.setRole(UserRole.FREELANCER);

        Application application = new Application();
        application.setId(5L);
        application.setJob(job);
        application.setFreelancer(freelancer);
        application.setStatus(ApplicationStatus.APPLIED);
        application.setAppliedAt(LocalDateTime.now().minusDays(1));

        Application other = new Application();
        other.setId(6L);
        other.setJob(job);
        other.setStatus(ApplicationStatus.APPLIED);
        other.setAppliedAt(LocalDateTime.now());

        when(applicationRepository.findById(application.getId())).thenReturn(Optional.of(application));
        when(applicationRepository.findByJobId(job.getId())).thenReturn(List.of(application, other));

        ApplicationResponse response = applicationService.updateStatus(application.getId(), ApplicationStatus.ACCEPTED, client);

        assertThat(response.status()).isEqualTo(ApplicationStatus.ACCEPTED);
        assertThat(job.getFreelancer()).isEqualTo(freelancer);
        assertThat(job.getStatus()).isEqualTo(JobStatus.IN_PROGRESS);
        assertThat(other.getStatus()).isEqualTo(ApplicationStatus.REJECTED);

        verify(applicationRepository).findById(application.getId());
        verify(applicationRepository).findByJobId(job.getId());
    }

    @Test
    void updateStatus_throwsForNonOwner() {
        User client = new User();
        client.setId(42L);
        client.setRole(UserRole.CLIENT);

        Job job = new Job();
        job.setId(100L);
        job.setClient(client);
        job.setStatus(JobStatus.OPEN);

        Application application = new Application();
        application.setId(5L);
        application.setJob(job);
        application.setStatus(ApplicationStatus.APPLIED);

        User otherClient = new User();
        otherClient.setId(99L);
        otherClient.setRole(UserRole.CLIENT);

        when(applicationRepository.findById(application.getId())).thenReturn(Optional.of(application));

        assertThatThrownBy(() -> applicationService.updateStatus(application.getId(), ApplicationStatus.ACCEPTED, otherClient))
                .isInstanceOf(SecurityException.class)
                .hasMessageContaining("Cannot modify applications");

        verify(applicationRepository).findById(application.getId());
        verify(applicationRepository, never()).findByJobId(job.getId());
    }

    @Test
    void updateStatus_rejectsAlreadyProcessedApplications() {
        User client = new User();
        client.setId(42L);
        client.setRole(UserRole.CLIENT);

        Job job = new Job();
        job.setId(100L);
        job.setClient(client);
        job.setStatus(JobStatus.OPEN);

        Application application = new Application();
        application.setId(5L);
        application.setJob(job);
        application.setStatus(ApplicationStatus.ACCEPTED);

        when(applicationRepository.findById(application.getId())).thenReturn(Optional.of(application));

        assertThatThrownBy(() -> applicationService.updateStatus(application.getId(), ApplicationStatus.REJECTED, client))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("already been processed");
    }

    @Test
    void updateStatus_requiresJobToBeOpen() {
        User client = new User();
        client.setId(42L);
        client.setRole(UserRole.CLIENT);

        Job job = new Job();
        job.setId(100L);
        job.setClient(client);
        job.setStatus(JobStatus.IN_PROGRESS);

        User freelancer = new User();
        freelancer.setId(77L);
        freelancer.setRole(UserRole.FREELANCER);

        Application application = new Application();
        application.setId(5L);
        application.setJob(job);
        application.setFreelancer(freelancer);
        application.setStatus(ApplicationStatus.APPLIED);

        when(applicationRepository.findById(application.getId())).thenReturn(Optional.of(application));

        assertThatThrownBy(() -> applicationService.updateStatus(application.getId(), ApplicationStatus.ACCEPTED, client))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Job is not open");
    }
}
