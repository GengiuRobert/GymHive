package com.example.gymhive.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
        this.products = products;
        this.totalItems = products.size();
        this.totalPrice = calculateTotalPrice(products);
    }

    public Double calculateTotalPrice(List<Product> shoppingCartProducts) {
        double totalPrice = 0.0;
        for(Product product : shoppingCartProducts){
            totalPrice += product.getPrice();
        }
        return totalPrice;
    }
}
