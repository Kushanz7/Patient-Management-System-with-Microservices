package org.kushan.billingservice.service;

import org.kushan.billingservice.dto.TransactionRequest;
import org.kushan.billingservice.model.BillingTransaction;
import org.kushan.billingservice.repository.BillingAccountRepository;
import org.kushan.billingservice.repository.BillingTransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BillingTransactionService {

    private final BillingAccountRepository accountRepo;
    private final BillingTransactionRepository transactionRepo;

    public BillingTransactionService(BillingAccountRepository accountRepo, BillingTransactionRepository transactionRepo) {
        this.accountRepo = accountRepo;
        this.transactionRepo = transactionRepo;
    }

    public void createTransaction(String accountId, String type, TransactionRequest req) {
        // Validate account
        if (!accountRepo.findByAccountId(accountId).isPresent()) {
            throw new RuntimeException("Billing account not found");
        }

        BillingTransaction tx = new BillingTransaction();
        tx.setBillingAccountId(accountId);
        tx.setType(type);
        tx.setAmount(req.getAmount());
        tx.setDescription(req.getDescription());
        transactionRepo.save(tx);
    }

    public List<BillingTransaction> getTransactions(String accountId) {
        return transactionRepo.findByBillingAccountId(accountId);
    }

    public double calculateBalance(String accountId) {
        List<BillingTransaction> txs = transactionRepo.findByBillingAccountId(accountId);

        double charges = txs.stream()
                .filter(t -> "CHARGE".equalsIgnoreCase(t.getType()))
                .mapToDouble(BillingTransaction::getAmount)
                .sum();

        double payments = txs.stream()
                .filter(t -> "PAYMENT".equalsIgnoreCase(t.getType()))
                .mapToDouble(BillingTransaction::getAmount)
                .sum();

        return charges - payments;
    }
}
