package org.kushan.billingservice.grpc;

import billing.BillingRequest;
import billing.BillingResponse;
import billing.BillingServiceGrpc;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.kushan.billingservice.model.BillingAccount;
import org.kushan.billingservice.repository.BillingAccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.UUID;

@GrpcService
public class BillingGrpcService extends BillingServiceGrpc.BillingServiceImplBase {
    private static final Logger log = LoggerFactory.getLogger(BillingGrpcService.class);
    private final BillingAccountRepository accountRepository;

    public BillingGrpcService(BillingAccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Override
    public void createBillingAccount(BillingRequest billingRequest, StreamObserver<BillingResponse> responseObserver) {
        log.info("Creating billing account for patientId={}", billingRequest.getPatientID());

        // Save account to DB
        BillingAccount account = new BillingAccount();
        account.setPatientId(billingRequest.getPatientID());
        account.setStatus("ACTIVE");

        // Manually set a UUID for accountId
        account.setAccountId(UUID.randomUUID().toString());

        accountRepository.save(account);

        BillingResponse response = BillingResponse.newBuilder()
                .setAccountId(account.getAccountId())
                .setStatus(account.getStatus())
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }
}
