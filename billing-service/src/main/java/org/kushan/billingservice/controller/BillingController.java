package org.kushan.billingservice.controller;

import org.kushan.billingservice.dto.TransactionRequest;
import org.kushan.billingservice.model.BillingTransaction;
import org.kushan.billingservice.service.BillingTransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/billing/accounts")
public class BillingController {

    private final BillingTransactionService billingService;

    public BillingController(BillingTransactionService billingService) {
        this.billingService = billingService;
    }

    @PostMapping("/{id}/charge")
    public ResponseEntity<String> charge(@PathVariable String id, @RequestBody TransactionRequest req) {
        billingService.createTransaction(id, "CHARGE", req);
        return ResponseEntity.ok("Charge added");
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<String> pay(@PathVariable String id, @RequestBody TransactionRequest req) {
        billingService.createTransaction(id, "PAYMENT", req);
        return ResponseEntity.ok("Payment recorded");
    }

    @GetMapping("/{id}/transactions")
    public ResponseEntity<List<BillingTransaction>> getTransactions(@PathVariable String id) {
        return ResponseEntity.ok(billingService.getTransactions(id));
    }

    @GetMapping("/{id}/balance")
    public ResponseEntity<Double> getBalance(@PathVariable String id) {
        return ResponseEntity.ok(billingService.calculateBalance(id));
    }
}
