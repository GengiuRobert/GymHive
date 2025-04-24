package com.example.gymhive.controller;

import com.example.gymhive.entity.AuthResponse;
import com.example.gymhive.entity.User;
import com.example.gymhive.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public AuthResponse signUp(@RequestBody User user) {
        return userService.signUp(user);
    }

    @PostMapping("/login")
    public AuthResponse signIn(@RequestBody User user) {
        return userService.logIn(user);
    }

    @PostMapping("/verify-email")
    @ResponseBody
    public String verifyEmail(@RequestBody Map<String, Object> payload)  {
        String idToken = payload.get("idToken").toString();
        return userService.sendEmailVerification(idToken);
    }

    @PostMapping("/delete/{idToken}")
    public String deleteAccount(@PathVariable String idToken) {
        if (userService.verifyIdToken(idToken)) {
            return userService.deleteAccount(idToken);
        } else {
            return "Invalid ID Token! Account deletion failed.";
        }
    }
}
