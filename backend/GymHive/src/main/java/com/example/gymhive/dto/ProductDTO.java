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

    @NotBlank(message = "Product name cannot be null or empty")
    private String name;

    @NotBlank(message = "Product description cannot be null or empty")
    private String description;

    @NotNull(message = "Product price cannot be null")
    @DecimalMin(value = "0.01", inclusive = true, message = "Product price must be greater than 0")
    private Double price;

    @NotBlank(message = "Product category cannot be null or empty")
    private String category;

}
