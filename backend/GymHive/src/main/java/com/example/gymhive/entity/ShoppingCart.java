package com.example.gymhive.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ShoppingCart {
    private String shoppingCartId;
    private String userId;
    private String userEmail;
    private List<Product> products;
    private Double totalPrice;
    private Integer totalItems;

    public ShoppingCart(String shoppingCartId, String userId, String userEmail, List<Product> products) {
        this.shoppingCartId = shoppingCartId;
        this.userId = userId;
        this.userEmail = userEmail;
        this.products = (products != null) ? products : new ArrayList<Product>();
        this.totalItems = this.products.size();
        this.totalPrice = calculateTotalPrice(this.products);
    }

    public Double calculateTotalPrice(List<Product> shoppingCartProducts) {
        double totalPrice = 0.0;
        for(Product product : shoppingCartProducts){
            totalPrice += product.getPrice();
        }
        return totalPrice;
    }

    public void addProduct(Product product) {
        if(this.products == null) {
            this.products = new ArrayList<>();
        }
        this.products.add(product);
        this.totalItems = this.products.size();
        this.totalPrice = calculateTotalPrice(this.products);
    }

    public boolean removeProduct(String productId) {
        if (this.products != null) {
            Iterator<Product> iterator = this.products.iterator();
            while (iterator.hasNext()) {
                Product product = iterator.next();
                if (product.getProductId() != null && product.getProductId().equals(productId)) {
                    iterator.remove();
                    this.totalItems = this.products.size();
                    this.totalPrice = calculateTotalPrice(this.products);
                    return true;
                }
            }
        }
        return false;
    }

    public void removeAllProducts(String productId) {
        if (this.products != null) {
            this.products.removeIf(p -> p.getProductId() != null && p.getProductId().equals(productId));
            this.totalItems = this.products.size();
            this.totalPrice = calculateTotalPrice(this.products);
        }
    }
}
