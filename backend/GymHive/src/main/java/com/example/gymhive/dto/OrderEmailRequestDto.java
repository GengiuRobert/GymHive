package com.example.gymhive.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.Valid;
import javax.validation.constraints.*;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderEmailRequestDto {

    @NotBlank(message = "Order ID must not be blank")
    private String customerID;

    @NotBlank(message = "Customer name must not be blank")
    private String customerName;

    @NotBlank(message = "Customer email must not be blank")
    @Email(message = "Customer email must be a valid email address")
    private String customerEmail;

    @NotBlank(message = "Order ID must not be blank")
    private String orderID;

    @NotNull(message = "Order date is required")
    @PastOrPresent(message = "Order date cannot be in the future")
    private Date orderDate;

    @NotEmpty(message = "At least one cart item is required")
    @Valid
    private List<CartItemDTO> items;

    @NotNull(message = "Address is required")
    @Valid
    private AddressDTO address;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @PositiveOrZero(message = "Shipping cost cannot be negative")
    private double shippingCost;

    @PositiveOrZero(message = "Tax cannot be negative")
    private double tax;
}
