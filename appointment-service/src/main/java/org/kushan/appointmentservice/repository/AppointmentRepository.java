package org.kushan.appointmentservice.repository;

import org.kushan.appointmentservice.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(String patientId);
    List<Appointment> findByDoctorIdAndAppointmentDate(String doctorId, LocalDate date);
    List<Appointment> findByDoctorId(String doctorId);
}
