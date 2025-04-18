package com.example.gymhive.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WishList {
    private String wishListId;
    private String userId;
    private String userEmail;
    private List<Product> favoriteProducts;

    public void addProduct(Product p) {
        if (favoriteProducts == null) {
            favoriteProducts = new ArrayList<>();
        }
        if (favoriteProducts.stream().noneMatch(x -> x.getProductId().equals(p.getProductId()))) {
            favoriteProducts.add(p);
        }
    }

    public void removeProduct(String productId) {
        if (favoriteProducts != null) {
                favoriteProducts.removeIf(p -> p.getProductId().equals(productId));
        }
    }
}
