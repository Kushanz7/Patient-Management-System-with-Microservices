package org.kushan.patientservice.controller;

import jakarta.validation.Valid;
import jakarta.validation.groups.Default;
import org.kushan.patientservice.dto.PatientRequestDTO;
import org.kushan.patientservice.dto.PatientResponseDTO;
import org.kushan.patientservice.dto.validators.CreatePatientValidationGroup;
import org.kushan.patientservice.service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/patients")
public class PatientController {
    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping
    public ResponseEntity<List<PatientResponseDTO>> getPatients(){
        List<PatientResponseDTO> patients = patientService.getPatients();
        return ResponseEntity.ok(patients);
    }

    @PostMapping
    public ResponseEntity<PatientResponseDTO> savePatient(@Validated({Default.class, CreatePatientValidationGroup.class}) @RequestBody PatientRequestDTO patientRequestDTO){
        PatientResponseDTO patient = patientService.savePatient(patientRequestDTO);
        return ResponseEntity.ok(patient);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PatientResponseDTO> updatePatient(@PathVariable UUID id, @Valid @RequestBody PatientRequestDTO patientRequestDTO){
        PatientResponseDTO patient = patientService.updatePatient(id, patientRequestDTO);
        return ResponseEntity.ok(patient);
    }

}
