package com.example.gymhive.controller;

import com.example.gymhive.dto.UserProfileDTO;
import com.example.gymhive.entity.UserProfile;
import com.example.gymhive.service.UserProfileService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/profiles")
@CrossOrigin(origins = "http://localhost:4200")
public class UserProfileController {

    private final UserProfileService userProfileService;
    private final ModelMapper modelMapper;

    @Autowired
    public UserProfileController(UserProfileService userProfileService, ModelMapper modelMapper) {
        this.userProfileService = userProfileService;
        this.modelMapper = modelMapper;
    }

    @PostMapping("/add-profile")
    @ResponseBody
    public String addUserProfile(@Valid @RequestBody UserProfileDTO userProfileDTO) {
        UserProfile userProfile = modelMapper.map(userProfileDTO, UserProfile.class);
        return this.userProfileService.addUserProfile(userProfile);
    }

    @DeleteMapping("/delete-profile-by-id/{userProfileId}")
    @ResponseBody
    public String deleteUserProfile(@PathVariable("userProfileId") String userProfileId) {
        return this.userProfileService.deleteUserProfile(userProfileId);
    }

    @PutMapping("/update-profile-by-id/{userId}")
    @ResponseBody
    public UserProfile updateUserProfile(@PathVariable("userId") String userId, @RequestBody UserProfile userProfile) throws ExecutionException, InterruptedException {
        return this.userProfileService.updateUserProfile(userId, userProfile);
    }

    @GetMapping("/get-all-profiles")
    @ResponseBody
    public List<UserProfile> getAllUserProfiles() {
        return this.userProfileService.getAllUserProfiles();
    }

    @GetMapping("/get-profile-by-id/{userProfileId}")
    @ResponseBody
    public UserProfile getUserProfileById(@PathVariable("userProfileId") String userProfileId) {
        return this.userProfileService.getUserProfile(userProfileId);
    }

}
