package com.example.gymhive.service;

import com.example.gymhive.entity.ShoppingCart;
import com.example.gymhive.repository.ShoppingCartRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShoppingCartService {

    private final ShoppingCartRepository shoppingCartRepository;

    public ShoppingCartService(ShoppingCartRepository shoppingCartRepository) {
        this.shoppingCartRepository = shoppingCartRepository;
    }

    public String addShoppingCart(ShoppingCart shoppingCart) {

        if(shoppingCart == null){
            throw new IllegalArgumentException("shoppingCart cannot be null");
        }
        if(shoppingCart.getTotalPrice() == null || shoppingCart.getTotalPrice() < 0){
            throw new IllegalArgumentException("totalPrice cannot be null");
        }
        if(shoppingCart.getTotalItems() == null || shoppingCart.getTotalItems() <=0 ){
            throw new IllegalArgumentException("totalItems cannot be null");
        }
        if(shoppingCart.getProducts() == null || shoppingCart.getProducts().isEmpty()){
            throw new IllegalArgumentException("products cannot be null or empty");
        }
        if(shoppingCart.getUserId() == null || shoppingCart.getUserId().trim().isEmpty()){
            throw new IllegalArgumentException("userId cannot be null or empty");
        }
        if(shoppingCart.getUserEmail() == null || shoppingCart.getUserEmail().trim().isEmpty()){
            throw new IllegalArgumentException("userEmail cannot be null or empty");
        }

        ShoppingCart existingShoppingCart = shoppingCartRepository.findOneByAllFields(
                shoppingCart.getUserId(),
                shoppingCart.getUserEmail(),
                shoppingCart.getTotalPrice(),
                shoppingCart.getTotalItems()
        );

        if(existingShoppingCart != null){
            throw new IllegalArgumentException("shoppingCart with these details already exists");
        }

        return shoppingCartRepository.save(shoppingCart);
    }

    public String deleteShoppingCart(String shoppingCartId) {
        if(shoppingCartId == null || shoppingCartId.trim().isEmpty()){
            throw new IllegalArgumentException("shoppingCartId cannot be null or empty");
        }
        return shoppingCartRepository.delete(shoppingCartId);
    }

    public String updateShoppingCart(String shoppingCartId,ShoppingCart updatedShoppingCart) {
        if(shoppingCartId == null || shoppingCartId.trim().isEmpty()){
            throw new IllegalArgumentException("shoppingCartId cannot be null or empty");
        }
        if(updatedShoppingCart == null){
            throw new IllegalArgumentException("updatedShoppingCart cannot be null");
        }

        return shoppingCartRepository.update(shoppingCartId, updatedShoppingCart);
    }

    public List<ShoppingCart> getAllShoppingCarts() {
        return shoppingCartRepository.getAll();
    }
}
