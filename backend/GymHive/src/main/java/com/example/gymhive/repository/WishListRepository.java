package com.example.gymhive.repository;

import com.example.gymhive.entity.ShoppingCart;
import com.example.gymhive.entity.WishList;
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
public class WishListRepository {

    private final FirestoreService firestoreService;

    public WishListRepository(FirestoreService firestoreService) {
        this.firestoreService = firestoreService;
    }

    public String save(WishList wishList) {
        CollectionReference col = firestoreService.getCollection("wishLists");
        DocumentReference doc = col.document();
        wishList.setWishListId(doc.getId());
        doc.set(wishList);
        return "wishList saved";
    }

    public WishList getWishListById(String wishListId) {
        CollectionReference collection = firestoreService.getCollection("wishLists");
        DocumentReference docRef = collection.document(wishListId);
        ApiFuture<DocumentSnapshot> future = docRef.get();

        try {
            DocumentSnapshot documentSnapshot = future.get();
            if (documentSnapshot.exists()) {
                return documentSnapshot.toObject(WishList.class);
            }
            return null;
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException(e);
        }
    }

    public WishList getWishListByUserId(String userId) {
        try {
            CollectionReference wishLists = firestoreService.getCollection("wishLists");
            Query query = wishLists.whereEqualTo("userId", userId);

            ApiFuture<QuerySnapshot> future = query.get();
            QuerySnapshot querySnapshot = future.get();

            if (!querySnapshot.isEmpty()) {
                DocumentSnapshot document = querySnapshot.getDocuments().getFirst();
                return document.toObject(WishList.class);
            }

            return null;
        } catch (InterruptedException | ExecutionException e){
            throw new RuntimeException(e);
        }
    }

    public String update(String wishListId,WishList updatedWishList) {

        if (wishListId == null || wishListId.trim().isEmpty()) {
            throw new IllegalArgumentException("wishListId cannot be null or empty");
        }

        CollectionReference collection = firestoreService.getCollection("wishLists");
        DocumentReference docRef = collection.document(wishListId);

        Map<String, Object> updates = new HashMap<>();

        if (updatedWishList.getUserEmail() != null && !updatedWishList.getUserEmail().trim().isEmpty()) {
            updates.put("userEmail", updatedWishList.getUserEmail());
        }

        if (updatedWishList.getUserId() != null && !updatedWishList.getUserId().trim().isEmpty()) {
            updates.put("userId", updatedWishList.getUserId());
        }

        if (updatedWishList.getFavoriteProducts() != null) {
            updates.put("favoriteProducts", updatedWishList.getFavoriteProducts());
        }

        if (updates.isEmpty()) {
            return "no valid fields provided to update";
        }

        docRef.update(updates);
        return "wishList updated";
    }


    public String delete(String wishListId) {
        CollectionReference collection = firestoreService.getCollection("wishLists");
        DocumentReference docRef = collection.document(wishListId);
        docRef.delete();
        return "wishList deleted";
    }


    public List<WishList> findByFavoriteProductsProductIdContains(String productId) {
        try {
            CollectionReference col = firestoreService.getCollection("wishLists");
            ApiFuture<QuerySnapshot> future = col.get();
            List<WishList> all = future.get()
                    .getDocuments()
                    .stream()
                    .map(d -> d.toObject(WishList.class))
                    .toList();

            return all.stream()
                    .filter(wl -> wl.getFavoriteProducts() != null &&
                            wl.getFavoriteProducts()
                                    .stream()
                                    .anyMatch(p -> productId.equals(p.getProductId())))
                    .collect(Collectors.toList());

        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Failed to query wishlists", e);
        }
    }
}
