package org.kushan.patientservice.service;

import org.kushan.patientservice.dto.PatientRequestDTO;
import org.kushan.patientservice.dto.PatientResponseDTO;
import org.kushan.patientservice.exception.EmailAlreadyExistsException;
import org.kushan.patientservice.mapper.PatientMapper;
import org.kushan.patientservice.model.Patient;
import org.kushan.patientservice.repository.PatientRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PatientService {
    private PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public List<PatientResponseDTO> getPatients(){
        List<Patient> patients = patientRepository.findAll();

//        List<PatientResponseDTO> patientResponseDTOS = patients.stream()
//                .map(patient -> PatientMapper.patientToPatientResponseDTO(patient)).toList();

        return patients.stream()
                .map(PatientMapper::patientToPatientResponseDTO).toList();
    }

    public PatientResponseDTO savePatient(PatientRequestDTO patientRequestDTO){
        if (patientRepository.existsByEmail(patientRequestDTO.getEmail())){
            throw new EmailAlreadyExistsException("Email already exists"+ patientRequestDTO.getEmail());
        }

        Patient newpatient = patientRepository.save(
                PatientMapper.toModel(patientRequestDTO)
        );
        return PatientMapper.patientToPatientResponseDTO(newpatient);
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<Map<String,String>> emailAlreadyExistsExceptionHandler(EmailAlreadyExistsException ex){

        Map<String,String> errors = new HashMap<>();
        errors.put("message", "Email already exists");
        return ResponseEntity.badRequest().body(errors);
    }

}
