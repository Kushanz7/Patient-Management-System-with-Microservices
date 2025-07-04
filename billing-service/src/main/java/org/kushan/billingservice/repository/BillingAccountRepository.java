package org.kushan.billingservice.repository;

import org.kushan.billingservice.model.BillingAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BillingAccountRepository extends JpaRepository <BillingAccount, Long> {
    Optional<BillingAccount> findByPatientId(String patientId);
    Optional<BillingAccount> findByAccountId(String accountId);
}
