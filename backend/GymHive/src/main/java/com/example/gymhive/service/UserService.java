package com.example.gymhive.service;

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

    public String signUp(User user) {
        try {
            return userRepository.signUp(user);
        } catch (Exception e) {
            return "Error during sign-up: " + e.getMessage();
        }
    }

    public String logIn(User user) {
        try {
            return userRepository.logIn(user);
        } catch (Exception e) {
            return "Error during logIn: " + e.getMessage();
        }
    }

    public String deleteAccount(String idToken) {
        try {
            return userRepository.deleteAccount(idToken);
        } catch (Exception e) {
            return "Error during account deletion: " + e.getMessage();
        }
    }
}
