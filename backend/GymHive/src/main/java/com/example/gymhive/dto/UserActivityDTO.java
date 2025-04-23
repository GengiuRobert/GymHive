package com.example.gymhive.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserActivityDTO {

    @NotBlank(message = "User ID cannot be null or empty")
    private String userId;

    @NotBlank(message = "User email cannot be null or empty")
    private String userEmail;

    @NotBlank(message = "Action cannot be null or empty")
    private String action;

    @NotBlank(message = "Timestamp date is required")
    private String timestamp;


}
