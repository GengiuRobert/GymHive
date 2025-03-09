package com.example.gymhive.repository;

import com.example.gymhive.entity.Product;
import com.example.gymhive.service.FirestoreService;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import org.springframework.stereotype.Repository;


@Repository
public class ProductRepository {

    private final FirestoreService firestoreService;

    public ProductRepository(FirestoreService firestoreService) {
        this.firestoreService = firestoreService;
    }

    public String save(Product product) {
        CollectionReference collection = firestoreService.getCollection("products");
        DocumentReference docRef = collection.document();
        product.setProductId(docRef.getId());
        docRef.set(product);
        return "product saved";
    }
}
