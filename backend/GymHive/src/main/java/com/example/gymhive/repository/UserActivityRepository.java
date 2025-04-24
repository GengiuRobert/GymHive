package com.example.gymhive.repository;

import com.example.gymhive.entity.UserActivity;
import com.example.gymhive.service.FirestoreService;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.QuerySnapshot;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Repository
public class UserActivityRepository {

    private final FirestoreService firestoreService;

    public UserActivityRepository(FirestoreService firestoreService) {
        this.firestoreService = firestoreService;
    }

    public String save(UserActivity activity) {
        CollectionReference coll = firestoreService.getCollection("userActivity");
        DocumentReference doc  = coll.document();
        activity.setActivityId(doc.getId());
        doc.set(activity);
        return "user activity saved";
    }

    public List<UserActivity> getAll() {
        CollectionReference collection = firestoreService.getCollection("userActivity");
        ApiFuture<QuerySnapshot> querySnapshot = collection.get();
        try {
            return querySnapshot.get().getDocuments()
                    .stream()
                    .map(document -> document.toObject(UserActivity.class))
                    .collect(Collectors.toList());
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException(e);
        }
    }

}
