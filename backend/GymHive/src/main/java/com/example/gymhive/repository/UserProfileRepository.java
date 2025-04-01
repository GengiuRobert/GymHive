package com.example.gymhive.repository;

import com.example.gymhive.entity.Product;
import com.example.gymhive.entity.UserProfile;
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
public class UserProfileRepository {

    private final FirestoreService firestoreService;

    public UserProfileRepository(FirestoreService firestoreService) {
        this.firestoreService = firestoreService;
    }

    public String save(UserProfile userProfile) {
        CollectionReference collection = firestoreService.getCollection("userProfiles");
        DocumentReference docRef = collection.document();
        userProfile.setUserProfileId(docRef.getId());
        docRef.set(userProfile);
        return "userProfile saved";
    }

    public String delete(String userProfileId) {
        CollectionReference collection = firestoreService.getCollection("userProfiles");
        DocumentReference docRef = collection.document(userProfileId);
        docRef.delete();
        return "userProfile deleted";
    }

    public UserProfile update(String userId, UserProfile updatedUserProfile) throws ExecutionException, InterruptedException {
        if(userId == null || userId.trim().isEmpty()){
            throw new IllegalArgumentException("userProfile ID must not be null or empty");
        }

        UserProfile docFoundByUserId = findByUserId(userId);

        CollectionReference collection = firestoreService.getCollection("userProfiles");
        DocumentReference docRef = collection.document(docFoundByUserId.getUserProfileId());

        Map<String, Object> updates = new HashMap<>();

        if(updatedUserProfile.getAddress() != null){
            if (updatedUserProfile.getAddress().getStreet() != null) {
                updates.put("address.street", updatedUserProfile.getAddress().getStreet());
            }
            if (updatedUserProfile.getAddress().getCity() != null) {
                updates.put("address.city", updatedUserProfile.getAddress().getCity());
            }
            if (updatedUserProfile.getAddress().getState() != null) {
                updates.put("address.state", updatedUserProfile.getAddress().getState());
            }
            if (updatedUserProfile.getAddress().getCountry() != null) {
                updates.put("address.country", updatedUserProfile.getAddress().getCountry());
            }
            if (updatedUserProfile.getAddress().getZipCode() != null) {
                updates.put("address.zipCode", updatedUserProfile.getAddress().getZipCode());
            }
        }

        if(updatedUserProfile.getPhone() != null && !updatedUserProfile.getPhone().trim().isEmpty()){
            updates.put("phone", updatedUserProfile.getPhone());
        }

        if(updatedUserProfile.getFirstName() != null && !updatedUserProfile.getFirstName().trim().isEmpty()){
            updates.put("firstName", updatedUserProfile.getFirstName());
        }

        if(updatedUserProfile.getLastName() != null && !updatedUserProfile.getLastName().trim().isEmpty()){
            updates.put("lastName", updatedUserProfile.getLastName());
        }

        if(updates.isEmpty()){
            throw new IllegalArgumentException("no valid fields provided to update");
        }

        try {
            ApiFuture<WriteResult> writeResult = docRef.update(updates);
            writeResult.get();
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("Update failed: " + e.getMessage());
        }

        return findByProfileId(docFoundByUserId.getUserProfileId());
    }

    public List<UserProfile> getAll(){
        CollectionReference collection = firestoreService.getCollection("userProfiles");
        ApiFuture<QuerySnapshot> querySnapshot = collection.get();
        try {
            return querySnapshot.get().getDocuments()
                    .stream()
                    .map(document -> document.toObject(UserProfile.class))
                    .collect(Collectors.toList());
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException(e);
        }
    }

    public UserProfile findByUserId(String userId) {
        try {
            CollectionReference profiles = firestoreService.getCollection("userProfiles");
            Query query = profiles.whereEqualTo("userId", userId);

            ApiFuture<QuerySnapshot> future = query.get();
            QuerySnapshot querySnapshot = future.get();

            if (!querySnapshot.isEmpty()) {
                DocumentSnapshot document = querySnapshot.getDocuments().getFirst();
                System.out.println((document.toObject(UserProfile.class)).toString());
                return document.toObject(UserProfile.class);
            }

            return null;
        } catch (InterruptedException | ExecutionException e){
            throw new RuntimeException(e);
        }
    }

    public UserProfile findByProfileId(String docId) {
        try {
            DocumentReference docRef = firestoreService.getCollection("userProfiles").document(docId);
            ApiFuture<DocumentSnapshot> future = docRef.get();
            DocumentSnapshot document = future.get();
            if (document.exists()) {
                return document.toObject(UserProfile.class);
            }
            return null;
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException(e);
        }
    }
}
