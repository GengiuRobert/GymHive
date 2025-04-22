package com.example.gymhive.repository;

import com.example.gymhive.entity.OrderEmailRequest;
import com.example.gymhive.service.FirestoreService;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import org.springframework.stereotype.Repository;

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
}
