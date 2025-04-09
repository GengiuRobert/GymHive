package com.example.gymhive.dto;

import com.example.gymhive.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ShoppingCartDTO {
    @NotBlank(message = "User ID is required")
    private String userId;

    @NotBlank(message = "User email is required")
    private String userEmail;

    @NotNull(message = "Products list cannot be null")
    @Size(min = 1, message = "There must be at least one product in the cart")
    private List<Product> products;
}
