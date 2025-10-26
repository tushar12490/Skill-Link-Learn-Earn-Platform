package com.skilllink.model;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class UserRoleTest {

    @Test
    void fromValue_handlesMixedCaseStrings() {
        assertThat(UserRole.fromValue("client")).isEqualTo(UserRole.CLIENT);
        assertThat(UserRole.fromValue("Freelancer")).isEqualTo(UserRole.FREELANCER);
        assertThat(UserRole.fromValue("LEARNER")).isEqualTo(UserRole.LEARNER);
    }

    @Test
    void fromValue_defaultsToLearnerForNullOrBlank() {
        assertThat(UserRole.fromValue(null)).isEqualTo(UserRole.LEARNER);
        assertThat(UserRole.fromValue("   ")).isEqualTo(UserRole.LEARNER);
    }

    @Test
    void fromValue_rejectsUnsupportedRole() {
        assertThatThrownBy(() -> UserRole.fromValue("manager"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Unsupported role");
    }
}
