package com.skilllink.service;

import com.skilllink.dto.UpdateUserRequest;
import com.skilllink.dto.UserResponse;
import com.skilllink.model.User;
import com.skilllink.repository.UserRepository;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User not found"));
    }

    public UserResponse getUserResponse(Long id) {
        return DtoMapper.toUserResponse(getById(id));
    }

    public UserResponse getCurrentUser(User user) {
        return DtoMapper.toUserResponse(user);
    }

    @Transactional
    public UserResponse updateUser(Long id, UpdateUserRequest request, User requester) {
        if (!requester.getId().equals(id)) {
            throw new SecurityException("Cannot update another user's profile");
        }
        User user = getById(id);
        if (request.name() != null) {
            user.setName(request.name());
        }
        if (request.bio() != null) {
            user.setBio(request.bio());
        }
        if (request.skills() != null) {
            user.setSkills(request.skills());
        }
        if (request.isMentor() != null) {
            user.setMentor(request.isMentor());
        }
        return DtoMapper.toUserResponse(user);
    }
}
