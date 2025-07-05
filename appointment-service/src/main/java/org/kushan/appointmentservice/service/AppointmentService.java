package org.kushan.appointmentservice.service;

import org.kushan.appointmentservice.dto.AppointmentRequest;
import org.kushan.appointmentservice.model.Appointment;
import org.kushan.appointmentservice.model.DoctorSchedule;
import org.kushan.appointmentservice.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorScheduleService doctorScheduleService;

    public Appointment bookAppointment(AppointmentRequest request) {
        // Fetch doctor schedule to get arrival time
        DoctorSchedule schedule = doctorScheduleService
                .getSchedule(request.getDoctorId(), request.getAppointmentDate())
                .orElseThrow(() -> new RuntimeException("Doctor schedule not found"));

        Appointment appointment = new Appointment();
        appointment.setPatientId(request.getPatientId());
        appointment.setDoctorId(request.getDoctorId());
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setAppointmentTime(request.getAppointmentTime());
        appointment.setDoctorArrivalTime(schedule.getArrivalTime());
        appointment.setStatus("SCHEDULED");

        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAppointmentsByPatient(String patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public Optional<Appointment> getAppointment(Long id) {
        return appointmentRepository.findById(id);
    }

    public List<Appointment> getAppointmentsByDoctor(String doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

}
