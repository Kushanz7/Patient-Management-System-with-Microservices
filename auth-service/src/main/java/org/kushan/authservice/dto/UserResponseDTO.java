package org.kushan.authservice.dto;

import java.util.UUID;

public class UserResponseDTO {

    UUID id;
    String email;
    String role;
    String fullName;
    String specialization;
    String phoneNumber;

    public UserResponseDTO(UUID id, String email, String role, String fullName, String specialization, String phoneNumber) {
        this.id = id;
        this.email = email;
        this.role = role;
        this.fullName = fullName;
        this.specialization = specialization;
        this.phoneNumber = phoneNumber;
    }

    public UUID getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getFullName() {
        return fullName;
    }

    public String getSpecialization() {
        return specialization;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }
}
