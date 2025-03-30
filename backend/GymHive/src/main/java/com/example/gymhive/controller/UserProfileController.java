package com.example.gymhive.controller;

import com.example.gymhive.entity.UserProfile;
import com.example.gymhive.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/profiles")
@CrossOrigin(origins = "http://localhost:4200")
public class UserProfileController {

    private final UserProfileService userProfileService;

    @Autowired
    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @PostMapping("/add-profile")
    @ResponseBody
    public String addUserProfile(@RequestBody UserProfile userProfile) {
        return this.userProfileService.addUserProfile(userProfile);
    }

    @DeleteMapping("/delete-profile-by-id/{userProfileId}")
    @ResponseBody
    public String deleteUserProfile(@PathVariable("userProfileId") String userProfileId) {
        return this.userProfileService.deleteUserProfile(userProfileId);
    }

    @PutMapping("/update-profile-by-id/{userProfileId}")
    @ResponseBody
    public String updateUserProfile(@PathVariable("userProfileId") String userProfileId, @RequestBody UserProfile userProfile) {
        return this.userProfileService.updateUserProfile(userProfileId, userProfile);
    }

    @GetMapping("/get-all-profiles")
    @ResponseBody
    public List<UserProfile> getAllUserProfiles() {
        return this.userProfileService.getAllUserProfiles();
    }

}
