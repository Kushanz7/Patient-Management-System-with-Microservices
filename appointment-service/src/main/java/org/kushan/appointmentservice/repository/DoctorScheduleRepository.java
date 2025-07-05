package org.kushan.appointmentservice.repository;

import org.kushan.appointmentservice.model.DoctorSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface DoctorScheduleRepository extends JpaRepository<DoctorSchedule, Long> {
    Optional<DoctorSchedule> findByDoctorIdAndDate(String doctorId, LocalDate date);
}

