package com.skilllink.auth;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

class PasswordHashTest {

    @Test
    void generateHashForKnownPassword() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hash = encoder.encode("Password@123");
        System.out.println("Generated hash: " + hash);
    }
}
