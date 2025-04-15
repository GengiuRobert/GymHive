package com.example.gymhive.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    private String productId;
    private String name;
    private String description;
    private Double price;
    private String categoryId;
    private String subCategoryId;
    private String imageUrl;
}
