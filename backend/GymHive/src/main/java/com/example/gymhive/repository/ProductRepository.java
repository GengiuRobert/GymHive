package com.example.gymhive.repository;

import com.example.gymhive.entity.Product;
import com.example.gymhive.service.FirestoreService;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
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
            throw new IllegalArgumentException("product ID must not be null or empty");
        }

        CollectionReference collection = firestoreService.getCollection("products");
        DocumentReference docRef = collection.document(productId);

        Map<String, Object> updates = new HashMap<>();

        if (updatedProduct.getName() != null && !updatedProduct.getName().trim().isEmpty()) {
            updates.put("name", updatedProduct.getName());
        }

        if (updatedProduct.getDescription() != null && !updatedProduct.getDescription().trim().isEmpty()) {
            updates.put("description", updatedProduct.getDescription());
        }

        if (updatedProduct.getPrice() != null && updatedProduct.getPrice() > 0) {
            updates.put("price", updatedProduct.getPrice());
        }

        if (updatedProduct.getCategoryId() != null && !updatedProduct.getCategoryId().trim().isEmpty()) {
            updates.put("categoryId", updatedProduct.getCategoryId());
        }

        if (updatedProduct.getSubCategoryId() != null && !updatedProduct.getSubCategoryId().trim().isEmpty()) {
            updates.put("subCategoryId", updatedProduct.getSubCategoryId());
        }

        if (updatedProduct.getImageUrl() != null && !updatedProduct.getImageUrl().trim().isEmpty()) {
            updates.put("imageUrl", updatedProduct.getImageUrl());
        }

        if (updates.isEmpty()) {
            return "no valid fields provided to update";
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

    public Product findOneByAllFields(String name, String description, Double price, String categoryId, String subCategoryId,String imageUrl) {
        CollectionReference collection = firestoreService.getCollection("products");

        Query query = collection.whereEqualTo("name", name)
                .whereEqualTo("description", description)
                .whereEqualTo("price", price)
                .whereEqualTo("categoryId", categoryId)
                .whereEqualTo("subCategoryId", subCategoryId)
                .whereEqualTo("subCategoryId", subCategoryId)
                .whereEqualTo("imageUrl", imageUrl)
                .limit(1);
        ApiFuture<QuerySnapshot> querySnapshot = query.get();

        try {
            List<QueryDocumentSnapshot> documents = querySnapshot.get().getDocuments();
            if (!documents.isEmpty()) {
                return documents.getFirst().toObject(Product.class);
            } else {
                return null;
            }
        } catch (InterruptedException | ExecutionException e){
            throw new RuntimeException(e);
        }
    }
}
