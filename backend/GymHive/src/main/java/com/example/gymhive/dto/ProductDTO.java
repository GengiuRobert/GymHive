package com.example.gymhive.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {

    @NotBlank(message = "Product ID cannot be null or empty")
    private String productId;

    @NotBlank(message = "Product name cannot be null or empty")
    private String name;

    @NotBlank(message = "Product description cannot be null or empty")
    private String description;

    @NotNull(message = "Product price cannot be null")
    @DecimalMin(value = "0.01", inclusive = true, message = "Product price must be greater than 0")
    private Double price;

    @NotBlank(message = "Product categoryId cannot be null or empty")
    private String categoryId;

    @NotBlank(message = "Product subCategoryId cannot be null or empty")
    private String subCategoryId;

    @NotBlank(message = "Product imageUrl cannot be null or empty")
    private String imageUrl;

}
