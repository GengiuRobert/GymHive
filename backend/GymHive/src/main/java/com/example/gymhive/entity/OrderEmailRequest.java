package com.example.gymhive.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderEmailRequest {
    private String          firestoreID;
    private String          customerID;
    private String          customerName;
    private String          customerEmail;
    private String          orderID;
    private Date            orderDate;
    private List<CartItem>  items;
    private Address         address;
    private String          phone;
    private double          shippingCost;
    private double          tax;
}
