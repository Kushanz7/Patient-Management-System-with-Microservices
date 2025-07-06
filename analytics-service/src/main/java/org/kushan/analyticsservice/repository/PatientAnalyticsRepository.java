package org.kushan.analyticsservice.repository;

import org.kushan.analyticsservice.model.PatientAnalyticsEvent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientAnalyticsRepository extends JpaRepository<PatientAnalyticsEvent, Long> {
    long countByEventType(String eventType);
}
