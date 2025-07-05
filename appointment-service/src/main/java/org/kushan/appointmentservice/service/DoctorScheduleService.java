package org.kushan.appointmentservice.service;

import org.kushan.appointmentservice.model.DoctorSchedule;
import org.kushan.appointmentservice.repository.DoctorScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

@Service
public class DoctorScheduleService {

    @Autowired
    private DoctorScheduleRepository repository;

    public DoctorSchedule addSchedule(DoctorSchedule schedule) {
        return repository.save(schedule);
    }

    public Optional<DoctorSchedule> getSchedule(String doctorId, LocalDate date) {
        return repository.findByDoctorIdAndDate(doctorId, date);
    }

    public Optional<DoctorSchedule> updateArrivalTime(String doctorId, LocalDate date, LocalTime arrivalTime) {
        return repository.findByDoctorIdAndDate(doctorId, date).map(schedule -> {
            schedule.setArrivalTime(arrivalTime);
            return repository.save(schedule);
        });
    }

}
