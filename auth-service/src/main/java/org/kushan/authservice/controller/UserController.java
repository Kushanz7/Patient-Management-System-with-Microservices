package org.kushan.authservice.controller;

import org.kushan.authservice.dto.CreateUserRequestDTO;
import org.kushan.authservice.dto.UserResponseDTO;
import org.kushan.authservice.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDTO> createUser(@RequestBody CreateUserRequestDTO request) {
        UserResponseDTO newUser = userService.createUser(request);
        return ResponseEntity.ok(newUser);
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<UserResponseDTO>> getAllDoctors() {
        return ResponseEntity.ok(userService.getUsersByRole("DOCTOR"));
    }
}