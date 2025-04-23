package com.example.gymhive.repository;

import com.example.gymhive.entity.OrderEmailRequest;
import com.example.gymhive.service.FirestoreService;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
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

    public OrderEmailRequest findByUserIdAndOrderId(String customerID, String orderID) {
        CollectionReference col = firestoreService.getCollection("orders");
        try {
            var query = col
                    .whereEqualTo("customerID", customerID)
                    .whereEqualTo("firestoreID", orderID)
                    .get()
                    .get();

            if (query.isEmpty()) {
                return null;
            }
            var doc = query.getDocuments().getFirst();
            return doc.toObject(OrderEmailRequest.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch order from Firestore", e);
        }
    }
}
