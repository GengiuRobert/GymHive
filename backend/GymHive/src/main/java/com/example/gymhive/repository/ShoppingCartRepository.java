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
        CollectionReference collecton = firestoreService.getCollection("shoppingCarts");
        DocumentReference docRef = collecton.document();
        shoppingCart.setShoppingCartId(docRef.getId());
        return "shoppingCart saved";
    }

    public String delete(String shoppingCartId) {
        CollectionReference collecton = firestoreService.getCollection("shoppingCarts");
        DocumentReference docRef = collecton.document(shoppingCartId);
        docRef.delete();
        return "shoppingCart deleted";
    }

    public String update(String shoppingCartId,ShoppingCart updatedShoppingCart) {

        if(shoppingCartId == null || shoppingCartId.trim().isEmpty()) {
            throw new IllegalArgumentException("ShoppingCart id cannot be null or empty");
        }

        CollectionReference collecton = firestoreService.getCollection("shoppingCarts");
        DocumentReference docRef = collecton.document();

        Map<String,Object> updates = new HashMap<>();

        if(updatedShoppingCart.getProducts() != null && !updatedShoppingCart.getProducts().isEmpty()) {
            updates.put("products",updatedShoppingCart.getProducts());
        }

        if(updatedShoppingCart.getTotalItems() != null && !(updatedShoppingCart.getTotalItems() >=0)){
            updates.put("totalItems",updatedShoppingCart.getTotalItems());
        }

        if(updatedShoppingCart.getUserEmail() != null && !updatedShoppingCart.getUserEmail().trim().isEmpty()) {
            updates.put("userEmail",updatedShoppingCart.getUserEmail());
        }

        if(updatedShoppingCart.getUserId() != null && !updatedShoppingCart.getUserId().trim().isEmpty()) {
            updates.put("userId",updatedShoppingCart.getUserId());
        }

        if(updatedShoppingCart.getTotalPrice() !=null && (updatedShoppingCart.getTotalPrice() >0)){
            updates.put("totalPrice",updatedShoppingCart.getTotalPrice());
        }

        if(updates.isEmpty()){
            return "no valid fields provided to update";
        }

        docRef.update(updates);

        return "shoppingCart updated";
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

    public ShoppingCart findOneByAllFields(String userId, String userEmail, Double totalPrice, Integer totalItems) {
        CollectionReference collection = firestoreService.getCollection("shoppingCarts");

        Query query = collection.whereEqualTo("userId", userId)
                .whereEqualTo("userEmail", userEmail)
                .whereEqualTo("totalPrice", totalPrice)
                .whereEqualTo("totalItems", totalItems)
                .limit(1);

        ApiFuture<QuerySnapshot> querySnapshot = query.get();

        try {
            List<QueryDocumentSnapshot> documents = querySnapshot.get().getDocuments();
            if (!documents.isEmpty()) {
                return documents.getFirst().toObject(ShoppingCart.class);
            } else {
                return null;
            }
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException(e);
        }
    }

}
