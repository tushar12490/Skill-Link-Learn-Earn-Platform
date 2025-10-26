package com.skilllink.auth;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.skilllink.dto.AuthResponse;
import com.skilllink.dto.RegisterRequest;
import com.skilllink.model.UserRole;
import com.skilllink.service.AuthService;

@SpringBootTest
class AuthRegisterTest {

    @Autowired
    private AuthService authService;

    @Test
    @Transactional
    void registerAssignsNewIdAndReturnsToken() {
        RegisterRequest request = new RegisterRequest(
                "New User",
                "newuser+test@skilllink.com",
                "Password@123",
                UserRole.LEARNER,
                null,
                null,
                false
        );

        AuthResponse response = authService.register(request);

        assertThat(response.token()).isNotEmpty();
        assertThat(response.user().email()).isEqualTo("newuser+test@skilllink.com");
    }
}
