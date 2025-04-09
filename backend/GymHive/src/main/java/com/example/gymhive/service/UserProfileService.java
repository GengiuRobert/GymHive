package com.example.gymhive.service;

import com.example.gymhive.entity.UserProfile;
import com.example.gymhive.repository.UserProfileRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;

    public UserProfileService(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    public String addUserProfile(UserProfile userProfile) {

        if(userProfileRepository.findByUserId(userProfile.getUserId()) != null) {
            throw new IllegalArgumentException("userProfile with that ID already exists");
        }

        return userProfileRepository.save(userProfile);
    }

    public String deleteUserProfile(String userProfileId) {
        if(userProfileId == null || userProfileId.trim().isEmpty()) {
            throw new IllegalArgumentException("userProfile ID cannot be null or empty");
        }

        return userProfileRepository.delete(userProfileId);
    }

    public UserProfile updateUserProfile(String userId,UserProfile updatedUserProfile) throws ExecutionException, InterruptedException {
        if(userId == null || userId.trim().isEmpty()) {
            throw new IllegalArgumentException("userProfile ID cannot be null or empty");
        }
        if(updatedUserProfile == null){
            throw new IllegalArgumentException("updatedUserProfile cannot be null");
        }

        return userProfileRepository.update(userId, updatedUserProfile);
    }

    public UserProfile getUserProfile(String userProfileId) {
        if(userProfileId == null || userProfileId.trim().isEmpty()) {
            throw new IllegalArgumentException("userProfile ID cannot be null or empty");
        }
        return userProfileRepository.findByUserId(userProfileId);
    }

    public List<UserProfile> getAllUserProfiles() {
        return userProfileRepository.getAll();
    }

}
