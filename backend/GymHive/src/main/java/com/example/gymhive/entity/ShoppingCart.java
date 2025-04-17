package com.example.gymhive.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ShoppingCart {
    private String shoppingCartId;
    private String userId;
    private String userEmail;
    private Map<Product, Integer> products = new HashMap<>();
    private Double totalPrice;
    private Integer totalItems;

    public ShoppingCart(String shoppingCartId, String userId, String userEmail, Map<Product, Integer> products) {
        this.shoppingCartId = shoppingCartId;
        this.userId = userId;
        this.userEmail = userEmail;
        this.products = products != null ? products : new HashMap<>();
        this.totalItems = calculateTotalItems();
        this.totalPrice = calculateTotalPrice();
    }

    public Integer calculateTotalItems() {
        int total = 0;
        for (Integer quantity : products.values()) {
            total += quantity;
        }
        return total;
    }


    public Double calculateTotalPrice() {
        double total = 0.0;
        for (Map.Entry<Product, Integer> entry : products.entrySet()) {
            total += entry.getKey().getPrice() * entry.getValue();
        }
        return total;
    }

    public void addProduct(Product product) {
        if (this.products.containsKey(product)) {
            this.products.put(product, this.products.get(product) + 1);
        } else {
            this.products.put(product, 1);
        }
        this.totalItems = calculateTotalItems();
        this.totalPrice = calculateTotalPrice();
    }

    public boolean removeProduct(Product product) {
        if (this.products.containsKey(product)) {
            this.products.remove(product);
            this.totalItems = calculateTotalItems();
            this.totalPrice = calculateTotalPrice();
            return true;
        }
        return false;
    }
}
