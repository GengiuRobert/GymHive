package com.example.gymhive.service;

import com.example.gymhive.entity.Product;
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

    public ShoppingCart addProductToShoppingCart(String shoppingCartId, Product product, int quantity) {
        ShoppingCart shoppingCart = shoppingCartRepository.getShoppingCartById(shoppingCartId);
        if(shoppingCart == null) {
            throw new IllegalArgumentException("Shopping Cart not found with ID: " + shoppingCartId);
        }
        for(int i=0;i<quantity;i++) {
            shoppingCart.addProduct(product);
        }
        shoppingCartRepository.update(shoppingCartId, shoppingCart);
        return shoppingCart;
    }

    public ShoppingCart removeProductFromShoppingCart(String shoppingCartId, String productId) {
        ShoppingCart shoppingCart = shoppingCartRepository.getShoppingCartById(shoppingCartId);
        if (shoppingCart == null) {
            throw new IllegalArgumentException("Shopping Cart not found with ID: " + shoppingCartId);
        }
        boolean removed = shoppingCart.removeProduct(productId);
        if (!removed) {
            throw new IllegalArgumentException("Product with ID " + productId + " not found in the shopping cart");
        }
        shoppingCartRepository.update(shoppingCartId, shoppingCart);
        return shoppingCart;
    }

    public ShoppingCart removeAllOfProduct(String shoppingCartId, String productId) {
        ShoppingCart cart = shoppingCartRepository.getShoppingCartById(shoppingCartId);
        if (cart == null) {
            throw new IllegalArgumentException("Shopping Cart not found with ID: " + shoppingCartId);
        }

        cart.removeAllProducts(productId);
        shoppingCartRepository.update(shoppingCartId, cart);

        return cart;
    }

    public ShoppingCart getShoppingCartByUserId(String userId) {
        if(userId == null || userId.trim().isEmpty()){
            throw new IllegalArgumentException("User id cannot be null or empty");
        }
        return shoppingCartRepository.getShoppingCartByUserId(userId);
    }

    public List<ShoppingCart> getAllShoppingCarts() {
        return shoppingCartRepository.getAll();
    }

}
