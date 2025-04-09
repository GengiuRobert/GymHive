package com.example.gymhive.dto;

import com.example.gymhive.entity.Address;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDTO {

    @NotBlank(message = "UserProfile userId cannot be null or empty")
    private String userId;

    @NotBlank(message = "First name cannot be null or empty")
    private String firstName;

    @NotBlank(message = "Last name cannot be null or empty")
    private String lastName;

    @NotBlank(message = "User email cannot be null or empty")
    private String userEmail;

    private String phone;

    private Address address;
}
