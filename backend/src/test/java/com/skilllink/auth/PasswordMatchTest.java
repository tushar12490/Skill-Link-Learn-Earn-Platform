package com.skilllink.auth;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

class PasswordMatchTest {

    @Test
    void seededHashMatchesPasswordAt123() {
        String seededHash = "$2a$10$E1nvnUbMJ1ZkWVeG2YnwsOS0/90q/n/Li/YoRTydM9xWBMlFI4vb2";
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        assertThat(encoder.matches("Password@123", seededHash)).isTrue();
    }
}
