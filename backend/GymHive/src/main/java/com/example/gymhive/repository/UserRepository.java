package com.example.gymhive.repository;

import com.example.gymhive.client.FirebaseUserClient;
import com.example.gymhive.entity.AuthResponse;
import com.example.gymhive.entity.User;
import org.springframework.stereotype.Repository;
import java.io.*;

@Repository
public class UserRepository {

    private final FirebaseUserClient firebaseUserClient;

    public UserRepository(FirebaseUserClient firebaseUserClient) {
        this.firebaseUserClient = firebaseUserClient;
    }

    public AuthResponse signUp(User user) throws IOException {
        return firebaseUserClient.signUp(user);
    }

    public AuthResponse logIn(User user) throws IOException {
        return firebaseUserClient.logIn(user);
    }

    public String sendEmailVerification(String idToken) throws IOException {
        return firebaseUserClient.sendEmailVerification(idToken);
    }

    public String deleteAccount(String idToken) throws IOException {
        return firebaseUserClient.deleteAccount(idToken);
    }
}
