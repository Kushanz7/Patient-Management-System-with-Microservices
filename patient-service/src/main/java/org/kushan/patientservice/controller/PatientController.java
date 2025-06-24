package org.kushan.patientservice.controller;

import jakarta.validation.Valid;
import org.kushan.patientservice.dto.PatientRequestDTO;
import org.kushan.patientservice.dto.PatientResponseDTO;
import org.kushan.patientservice.service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<PatientResponseDTO> savePatient(@Valid @RequestBody PatientRequestDTO patientRequestDTO){
        PatientResponseDTO patient = patientService.savePatient(patientRequestDTO);
        return ResponseEntity.ok(patient);
    }
}
