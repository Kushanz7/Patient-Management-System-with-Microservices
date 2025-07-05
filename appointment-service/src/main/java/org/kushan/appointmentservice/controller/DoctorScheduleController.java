package org.kushan.appointmentservice.controller;

import org.kushan.appointmentservice.model.DoctorSchedule;
import org.kushan.appointmentservice.service.DoctorScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/schedule")
public class DoctorScheduleController {

    @Autowired
    private DoctorScheduleService service;

    @PostMapping
    public ResponseEntity<DoctorSchedule> addSchedule(@RequestBody DoctorSchedule schedule) {
        return ResponseEntity.ok(service.addSchedule(schedule));
    }

    @GetMapping("/{doctorId}/{date}")
    public ResponseEntity<DoctorSchedule> getSchedule(
            @PathVariable String doctorId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return service.getSchedule(doctorId, date)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{doctorId}/{date}")
    public ResponseEntity<DoctorSchedule> updateArrivalTime(
            @PathVariable String doctorId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestBody DoctorSchedule updated) {

        return service.updateArrivalTime(doctorId, date, updated.getArrivalTime())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

}
