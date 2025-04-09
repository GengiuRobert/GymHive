package com.example.gymhive.repository;

import com.example.gymhive.entity.Category;
import com.example.gymhive.entity.SubCategory;
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
public class SubCategoryRepository {

    private final FirestoreService firestoreService;

    public SubCategoryRepository(FirestoreService firestoreService) {
        this.firestoreService = firestoreService;
    }

    public String save(SubCategory subCategory) {

        CollectionReference collection = firestoreService.getCollection("subCategory");
        DocumentReference docRef = collection.document();
        subCategory.setSubCategoryId(docRef.getId());
        docRef.set(subCategory);
        return "subCategory saved";
    }

    public String delete(String subCategoryId) {
        CollectionReference collection = firestoreService.getCollection("subCategory");
        DocumentReference docRef = collection.document(subCategoryId);
        docRef.delete();
        return "subCategory deleted";
    }

    public String update(String subCategoryId, SubCategory updatedSubCategory) {

        if(subCategoryId == null || subCategoryId.trim().isEmpty()){
            throw new IllegalArgumentException("subCategory ID must not be null or empty");
        }

        CollectionReference collection = firestoreService.getCollection("subCategory");
        DocumentReference docRef = collection.document(subCategoryId);

        Map<String, Object> updates = new HashMap<>();

        if (updatedSubCategory.getSubCategoryName() != null && !updatedSubCategory.getSubCategoryName().trim().isEmpty()) {
            updates.put("subCategoryName", updatedSubCategory.getSubCategoryName());
        }

        docRef.update(updates);

        return "subCategory updated";
    }

    public SubCategory findSubCategoryById(String subCategoryId) throws ExecutionException, InterruptedException {
        CollectionReference collection = firestoreService.getCollection("subCategory");
        DocumentReference docRef = collection.document(subCategoryId);
        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot document = future.get();
        if (document.exists()) {
            return document.toObject(SubCategory.class);
        }
        return null;
    }

    public SubCategory findSubCategoryByNameAndParentId(String subCategoryName, String parentCategoryId) {
        try {
            CollectionReference subCategories = firestoreService.getCollection("subCategory");
            Query query = subCategories.whereEqualTo("subCategoryName", subCategoryName)
                    .whereEqualTo("parentCategoryId", parentCategoryId);
            ApiFuture<QuerySnapshot> future = query.get();
            QuerySnapshot querySnapshot = future.get();

            if (!querySnapshot.isEmpty()) {
                DocumentSnapshot document = querySnapshot.getDocuments().getFirst();
                return document.toObject(SubCategory.class);
            }
            return null;
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("Error getting subcategory by name and parentId", e);
        }
    }

    public List<SubCategory> getAll() {
        CollectionReference subCategories = firestoreService.getCollection("subCategory");
        ApiFuture<QuerySnapshot> future = subCategories.get();
        try {
            QuerySnapshot querySnapshot = future.get();
            return querySnapshot.getDocuments()
                    .stream()
                    .map(document -> document.toObject(SubCategory.class))
                    .collect(Collectors.toList());
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("Error getting all subCategories", e);
        }
    }

}
