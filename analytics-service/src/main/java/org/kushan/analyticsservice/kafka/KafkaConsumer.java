package org.kushan.analyticsservice.kafka;

import com.google.protobuf.InvalidProtocolBufferException;
import org.kushan.analyticsservice.model.PatientAnalyticsEvent;
import org.kushan.analyticsservice.repository.PatientAnalyticsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import patient.events.PatientEvent;

import java.time.LocalDateTime;

@Service
public class KafkaConsumer {

    @Autowired
    private PatientAnalyticsRepository repo;

    private static final Logger log = LoggerFactory.getLogger(KafkaConsumer.class);

    @KafkaListener(topics = "patient", groupId = "analytics-service")

    public void consumeEvent(byte[] event){
        try {
            PatientEvent pe = PatientEvent.parseFrom(event);

            PatientAnalyticsEvent entity = new PatientAnalyticsEvent();
            entity.setPatientId(pe.getPatientId());
            entity.setName(pe.getName());
            entity.setEmail(pe.getEmail());
            entity.setEventType(pe.getEventType());
            entity.setReceivedAt(LocalDateTime.now());

            repo.save(entity);

            log.info("Stored patient event for: {}", pe.getPatientId());
        } catch (InvalidProtocolBufferException e) {
            log.error("Error parsing event", e);
        }
    }
}
