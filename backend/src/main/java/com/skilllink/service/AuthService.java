package com.skilllink.service;

import com.skilllink.dto.AuthRequest;
import com.skilllink.dto.AuthResponse;
import com.skilllink.dto.RegisterRequest;
import com.skilllink.dto.UserResponse;
import com.skilllink.model.User;
import com.skilllink.model.UserRole;
import com.skilllink.repository.UserRepository;
import com.skilllink.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(request.role() != null ? request.role() : UserRole.LEARNER);
        user.setSkills(request.skills());
        user.setBio(request.bio());
        user.setMentor(Boolean.TRUE.equals(request.isMentor()));

        User saved = userRepository.save(user);
        String token = jwtService.generateToken(saved);
        UserResponse response = DtoMapper.toUserResponse(saved);
        return new AuthResponse(token, response);
    }

    public AuthResponse authenticate(AuthRequest request) {
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                request.email(),
                request.password()
        );
        authenticationManager.authenticate(authToken);
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        String token = jwtService.generateToken(user);
        return new AuthResponse(token, DtoMapper.toUserResponse(user));
    }
}
