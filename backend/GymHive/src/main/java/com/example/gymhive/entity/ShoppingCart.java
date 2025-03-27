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
}
