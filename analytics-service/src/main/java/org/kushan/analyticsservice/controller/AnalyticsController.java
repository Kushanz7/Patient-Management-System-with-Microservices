package org.kushan.analyticsservice.controller;

import org.kushan.analyticsservice.repository.PatientAnalyticsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    @Autowired
    private PatientAnalyticsRepository repo;

    @GetMapping("/patient-registrations")
    public long totalRegisteredPatients() {
        return repo.countByEventType("REGISTERED");
    }
}
