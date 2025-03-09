package com.example.gymhive.repository;

import com.example.gymhive.entity.Product;
import com.example.gymhive.service.FirestoreService;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.QuerySnapshot;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;


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

    public String delete(String productId) {
        CollectionReference collection = firestoreService.getCollection("products");
        DocumentReference docRef = collection.document(productId);
        docRef.delete();
        return "product deleted";
    }

    public String update(String productId, Product updatedProduct) {

        if(productId == null || productId.trim().isEmpty()){
            throw new IllegalArgumentException("Product ID must not be null or empty");
        }

        CollectionReference collection = firestoreService.getCollection("products");
        DocumentReference docRef = collection.document(productId);


        Map<String, Object> updates = new HashMap<>();
        if(updatedProduct.getName() != null) {
            updates.put("name", updatedProduct.getName());
        }
        if(updatedProduct.getDescription() != null) {
            updates.put("description", updatedProduct.getDescription());
        }
        if(updatedProduct.getPrice() != null) {
            updates.put("price", updatedProduct.getPrice());
        }

        docRef.update(updates);
        return "product updated";
    }

    public List<Product> getAll() {
        CollectionReference collection = firestoreService.getCollection("products");
        ApiFuture<QuerySnapshot> querySnapshot = collection.get();
        try {
            return querySnapshot.get().getDocuments()
                    .stream()
                    .map(document -> document.toObject(Product.class))
                    .collect(Collectors.toList());
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException(e);
        }
    }
}
