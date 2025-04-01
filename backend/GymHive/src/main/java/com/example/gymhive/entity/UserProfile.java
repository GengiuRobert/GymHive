package com.example.gymhive.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {
    private String userProfileId;
    private String userId;
    private String firstName;
    private String lastName;
    private String userEmail;
    private String phone;
    private Address address;

    @Override
    public String toString() {
        return String.format("UserProfile { userProfileId='%s', userId='%s', firstName='%s', lastName='%s', userEmail='%s', phone='%s', address=%s }",
                userProfileId, userId, firstName, lastName, userEmail ,phone, address != null ? address.toString() : "No address provided");
    }
}
