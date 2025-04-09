package com.example.gymhive.repository;

import com.example.gymhive.entity.Category;
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
public class CategoryRepository {
    private final FirestoreService firestoreService;

    public CategoryRepository(FirestoreService firestoreService) {
        this.firestoreService = firestoreService;
    }

    public String save(Category category) {
        CollectionReference collection = firestoreService.getCollection("category");
        DocumentReference docRef = collection.document();
        category.setCategoryId(docRef.getId());
        docRef.set(category);
        return "category saved";
    }

    public String delete(String categoryId) {
        CollectionReference collection = firestoreService.getCollection("category");
        DocumentReference docRef = collection.document(categoryId);
        docRef.delete();
        return "category deleted";
    }

    public String update(String categoryId, Category updatedCategory) {

        if(categoryId == null || categoryId.trim().isEmpty()){
            throw new IllegalArgumentException("category ID must not be null or empty");
        }

        CollectionReference collection = firestoreService.getCollection("category");
        DocumentReference docRef = collection.document(categoryId);

        Map<String, Object> updates = new HashMap<>();

        if (updatedCategory.getCategoryName() != null && !updatedCategory.getCategoryName().trim().isEmpty()) {
            updates.put("categoryName", updatedCategory.getCategoryName());
        }

        docRef.update(updates);

        return "category updated";
    }

    public Category findCategoryById(String categoryId) throws ExecutionException, InterruptedException {
        CollectionReference collection = firestoreService.getCollection("category");
        DocumentReference docRef = collection.document(categoryId);
        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot document = future.get();
        if (document.exists()) {
            return document.toObject(Category.class);
        }
        return null;
    }

    public Category findCategoryByName(String categoryName) {
        try {
            CollectionReference categories = firestoreService.getCollection("category");

            Query query = categories.whereEqualTo("categoryName", categoryName);
            ApiFuture<QuerySnapshot> future = query.get();
            QuerySnapshot querySnapshot = future.get();

            if (!querySnapshot.isEmpty()) {
                DocumentSnapshot document = querySnapshot.getDocuments().getFirst();
                return document.toObject(Category.class);
            }

            return null;
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("Error getting category by name", e);
        }
    }

    public List<Category> getAll() {
        CollectionReference categories = firestoreService.getCollection("category");
        ApiFuture<QuerySnapshot> future = categories.get();
        try {
            QuerySnapshot querySnapshot = future.get();
            return querySnapshot.getDocuments()
                    .stream()
                    .map(document -> document.toObject(Category.class))
                    .collect(Collectors.toList());
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("Error getting all categories", e);
        }
    }
}
