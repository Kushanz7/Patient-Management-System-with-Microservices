package org.kushan.authservice.service;

import org.kushan.authservice.dto.CreateUserRequestDTO;
import org.kushan.authservice.dto.UserResponseDTO;
import org.kushan.authservice.model.User;
import org.kushan.authservice.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final PasswordEncoder passwordEncoder;

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<User> findByEmail(String email){
        return userRepository.findByEmail(email);
    }

    public UserResponseDTO createUser(CreateUserRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setFullName(request.getFullName());
        user.setSpecialization(request.getSpecialization());
        user.setPhoneNumber(request.getPhoneNumber());

        User savedUser = userRepository.save(user);
        return mapToUserResponse(savedUser);
    }

    public List<UserResponseDTO> getUsersByRole(String role) {
        return userRepository.findByRole(role).stream()
                .map(this::mapToUserResponse)
                .toList();
    }

    private UserResponseDTO mapToUserResponse(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                user.getFullName(),
                user.getSpecialization(),
                user.getPhoneNumber()
        );
    }

    public Optional<UserResponseDTO> getUserByIdAndRole(UUID id, String role) {
        return userRepository.findById(id)
                .filter(user -> user.getRole().equalsIgnoreCase(role))
                .map(this::mapToUserResponse);
    }

}
