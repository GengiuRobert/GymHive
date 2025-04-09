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
