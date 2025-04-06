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

    public AuthResponse signUp(User user) throws Exception {
        try {
            return userRepository.signUp(user);
        } catch (Exception e) {
            throw new Exception("[SERVICE] An error occurred during sign-up: " + e.getMessage() +"\n\n");
        }
    }

    public AuthResponse logIn(User user) throws Exception {
        try {
            return userRepository.logIn(user);
        } catch (Exception e) {
            throw new Exception("[SERVICE] An error occurred during log-in: " + e.getMessage() +"\n\n");
        }
    }

    public String sendEmailVerification(String idToken) throws Exception {
        try {
            return userRepository.sendEmailVerification(idToken);
        }catch (Exception e){
            throw new Exception("[SERVICE] An error occurred during sendEmailVerification: " + e.getMessage() +"\n\n");
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
