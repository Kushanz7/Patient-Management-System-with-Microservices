package org.kushan.billingservice.repository;

import org.kushan.billingservice.model.BillingTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillingTransactionRepository extends JpaRepository <BillingTransaction, Long> {
    List<BillingTransaction> findByBillingAccountId(String billingAccountId);
}
