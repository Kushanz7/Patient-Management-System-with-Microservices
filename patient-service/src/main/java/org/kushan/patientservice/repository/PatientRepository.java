package org.kushan.patientservice.repository;

import org.apache.commons.digester.annotations.rules.BeanPropertySetter;
import org.kushan.patientservice.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PatientRepository extends JpaRepository<Patient, UUID> {
    boolean existsByEmail(String email);
    boolean existsByEmailAndIdNot(String email, UUID id);

    @Query("SELECT p FROM Patient p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Patient> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(@Param("query") String query, @Param("query") String query2);
}
