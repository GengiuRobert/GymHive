package com.example.gymhive.service;

import com.example.gymhive.entity.AuthResponse;
import com.example.gymhive.entity.User;
import com.example.gymhive.repository.UserRepository;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean verifyIdToken(String idToken) {
        try {
            FirebaseAuth.getInstance().verifyIdToken(idToken);

            return true;
        } catch (FirebaseAuthException e) {
            System.out.println("Invalid ID Token: " + e.getMessage());
            return false;
        }
    }

    public AuthResponse signUp(User user) {
        try {
            return userRepository.signUp(user);
        } catch (Exception e) {
            throw new RuntimeException("Sign-up failed: " + e.getMessage(), e);
        }
    }

    public AuthResponse logIn(User user) {
        try {
            return userRepository.logIn(user);
        } catch (Exception e) {
            throw new RuntimeException("Log-in failed: " + e.getMessage(), e);
        }
    }

    public String sendEmailVerification(String idToken) {
        try {
            return userRepository.sendEmailVerification(idToken);
        } catch (Exception e) {
            throw new RuntimeException("Email verification failed: " + e.getMessage(), e);
        }
    }

    public String deleteAccount(String idToken) {
        try {
            FirebaseAuth.getInstance().verifyIdToken(idToken);
            return userRepository.deleteAccount(idToken);
        } catch (FirebaseAuthException e) {
            return "Invalid ID Token! Account deletion failed.";
        } catch (Exception e) {
            throw new RuntimeException("Delete account failed: " + e.getMessage(), e);
        }
    }
}
