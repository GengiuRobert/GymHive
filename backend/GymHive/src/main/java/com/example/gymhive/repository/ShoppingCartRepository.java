package com.example.gymhive.repository;

import com.example.gymhive.entity.ShoppingCart;
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
public class ShoppingCartRepository {

    private final FirestoreService firestoreService;

    public ShoppingCartRepository(FirestoreService firestoreService) {
        this.firestoreService = firestoreService;
    }

    public String save(ShoppingCart shoppingCart) {
        CollectionReference collection = firestoreService.getCollection("shoppingCarts");
        DocumentReference docRef = collection.document();
        shoppingCart.setShoppingCartId(docRef.getId());
        docRef.set(shoppingCart);
        return "shoppingCart saved";
    }

    public String delete(String shoppingCartId) {
        CollectionReference collection = firestoreService.getCollection("shoppingCarts");
        DocumentReference docRef = collection.document(shoppingCartId);
        docRef.delete();
        return "shoppingCart deleted";
    }

    public String update(String shoppingCartId,ShoppingCart updatedShoppingCart) {

        if(shoppingCartId == null || shoppingCartId.trim().isEmpty()) {
            throw new IllegalArgumentException("ShoppingCart id cannot be null or empty");
        }

        CollectionReference collection = firestoreService.getCollection("shoppingCarts");
        DocumentReference docRef = collection.document(shoppingCartId);

        Map<String,Object> updates = new HashMap<>();

        if(updatedShoppingCart.getProducts() != null) {
            updates.put("products", updatedShoppingCart.getProducts());
            updates.put("totalItems", updatedShoppingCart.getProducts().size());
            updates.put("totalPrice", updatedShoppingCart.calculateTotalPrice(updatedShoppingCart.getProducts()));
        }

        if(updatedShoppingCart.getUserEmail() != null && !updatedShoppingCart.getUserEmail().trim().isEmpty()) {
            updates.put("userEmail",updatedShoppingCart.getUserEmail());
        }

        if(updatedShoppingCart.getUserId() != null && !updatedShoppingCart.getUserId().trim().isEmpty()) {
            updates.put("userId",updatedShoppingCart.getUserId());
        }

        if(updates.isEmpty()){
            return "no valid fields provided to update";
        }

        docRef.update(updates);

        return "shoppingCart updated";
    }

    public ShoppingCart getShoppingCartById(String shoppingCartId) {
        CollectionReference collection = firestoreService.getCollection("shoppingCarts");
        DocumentReference docRef = collection.document(shoppingCartId);
        ApiFuture<DocumentSnapshot> future = docRef.get();
        try {
            DocumentSnapshot documentSnapshot = future.get();
            if (documentSnapshot.exists()) {
                return documentSnapshot.toObject(ShoppingCart.class);
            }
            return null;
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException(e);
        }
    }

    public ShoppingCart getShoppingCartByUserId(String userId) {
        try {
            CollectionReference shoppingCarts = firestoreService.getCollection("shoppingCarts");
            Query query = shoppingCarts.whereEqualTo("userId", userId);

            ApiFuture<QuerySnapshot> future = query.get();
            QuerySnapshot querySnapshot = future.get();

            if (!querySnapshot.isEmpty()) {
                DocumentSnapshot document = querySnapshot.getDocuments().getFirst();
                return document.toObject(ShoppingCart.class);
            }

            return null;
        } catch (InterruptedException | ExecutionException e){
            throw new RuntimeException(e);
        }
    }

    public List<ShoppingCart> getAll() {
        CollectionReference collection = firestoreService.getCollection("shoppingCarts");
        ApiFuture<QuerySnapshot> querySnapshot = collection.get();

        try{
            return querySnapshot.get().getDocuments()
                    .stream()
                    .map(document -> document.toObject(ShoppingCart.class))
                    .collect(Collectors.toList());

        }catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException(e);
        }

    }

}
