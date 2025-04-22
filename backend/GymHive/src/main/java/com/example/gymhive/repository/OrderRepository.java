package com.example.gymhive.repository;

import com.example.gymhive.entity.OrderEmailRequest;
import com.example.gymhive.service.FirestoreService;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Repository
public class OrderRepository {

    private final FirestoreService firestoreService;

    public OrderRepository(FirestoreService firestoreService) {
        this.firestoreService = firestoreService;
    }

    public String save(OrderEmailRequest orderEmailRequest) {
        CollectionReference collection = firestoreService.getCollection("orders");
        DocumentReference docRef = collection.document();
        orderEmailRequest.setFirestoreID(docRef.getId());
        docRef.set(orderEmailRequest);
        return "orderEmailRequest saved";
    }

    public List<OrderEmailRequest> findByUserId(String customerId) throws InterruptedException, ExecutionException {
        CollectionReference coll = firestoreService.getCollection("orders");
        ApiFuture<QuerySnapshot> future = coll.whereEqualTo("customerID", customerId).get();
        List<QueryDocumentSnapshot> docs = future.get().getDocuments();

        return docs.stream()
                .map(d -> d.toObject(OrderEmailRequest.class))
                .collect(Collectors.toList());
    }
}
