package com.example.gymhive.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String idToken;
    private String email;
    private String refreshToken;
    private String expiresIn;
    private String localId;
}
