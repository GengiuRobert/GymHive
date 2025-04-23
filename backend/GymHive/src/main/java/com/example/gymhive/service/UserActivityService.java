package com.example.gymhive.service;

import com.example.gymhive.entity.UserActivity;
import com.example.gymhive.repository.UserActivityRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserActivityService {
    private final UserActivityRepository userActivityRepository;

    public UserActivityService(UserActivityRepository userActivityRepository) {
        this.userActivityRepository = userActivityRepository;
    }

    public String recordActivity(UserActivity userActivity) {
        return userActivityRepository.save(userActivity);
    }

    public List<UserActivity> getAllUserActivities() { return userActivityRepository.getAll(); }

}
