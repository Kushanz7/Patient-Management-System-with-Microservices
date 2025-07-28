package org.kushan.patientservice.service;

import org.apache.kafka.clients.producer.KafkaProducer;
import org.kushan.patientservice.dto.PatientRequestDTO;
import org.kushan.patientservice.dto.PatientResponseDTO;
import org.kushan.patientservice.exception.EmailAlreadyExistsException;
import org.kushan.patientservice.exception.PatientNotFoundException;
import org.kushan.patientservice.grpc.BillingServiceGrpcClient;
import org.kushan.patientservice.kafka.kafkaProducer;
import org.kushan.patientservice.mapper.PatientMapper;
import org.kushan.patientservice.model.Patient;
import org.kushan.patientservice.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class PatientService {
    private final kafkaProducer kafkaProducer;
    private PatientRepository patientRepository;
    private final BillingServiceGrpcClient billingServiceGrpcClient;

    public PatientService(PatientRepository patientRepository, BillingServiceGrpcClient billingServiceGrpcClient, kafkaProducer kafkaProducer) {
        this.patientRepository = patientRepository;
        this.billingServiceGrpcClient = billingServiceGrpcClient;
        this.kafkaProducer = kafkaProducer;
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

        billingServiceGrpcClient.createBillingAccount(newpatient.getId().toString(), newpatient.getName(), newpatient.getEmail());

        kafkaProducer.sendEvent(newpatient);

        return PatientMapper.patientToPatientResponseDTO(newpatient);
    }

    public PatientResponseDTO updatePatient(UUID id, PatientRequestDTO patientRequestDTO){
        Patient patient = patientRepository.findById(id).orElseThrow(
                () -> new PatientNotFoundException("Patient not found with id: " + id)
        );

        if (patientRepository.existsByEmailAndIdNot(patientRequestDTO.getEmail(),id)){
            throw new EmailAlreadyExistsException("Email already exists"+ patientRequestDTO.getEmail());
        }

        patient.setName(patientRequestDTO.getName());
        patient.setAddress(patientRequestDTO.getAddress());
        patient.setEmail(patientRequestDTO.getEmail());
        patient.setDateOfBirth(LocalDate.parse(patientRequestDTO.getDateOfBirth()));

        Patient updatedPatient = patientRepository.save(patient);
        return PatientMapper.patientToPatientResponseDTO(updatedPatient);
    }

    public void deletePatient(UUID id){
        patientRepository.deleteById(id);
    }

    public PatientResponseDTO getPatientById(UUID id) {
        Patient patient = patientRepository.findById(id).orElseThrow(
                () -> new PatientNotFoundException("Patient not found with id: " + id)
        );
        return PatientMapper.patientToPatientResponseDTO(patient);
    }
    
    public List<PatientResponseDTO> searchPatients(String query) {
        List<Patient> patients = patientRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(query, query);
        return patients.stream()
                .map(PatientMapper::patientToPatientResponseDTO)
                .toList();
    }
}