package com.example.gymhive.controller;

import com.example.gymhive.dto.UserActivityDTO;
import com.example.gymhive.entity.UserActivity;
import com.example.gymhive.service.UserActivityService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/activity")
@CrossOrigin(origins = "http://localhost:4200")
public class UserActivityController {

    private final UserActivityService userActivityService;
    private final ModelMapper modelMapper;

    @Autowired
    public UserActivityController(UserActivityService userActivityService, ModelMapper modelMapper) {
        this.userActivityService = userActivityService;
        this.modelMapper = modelMapper;
    }

    @PostMapping("/record-activity")
    public String recordUserActivity(@RequestBody UserActivityDTO userActivityDTO) {
        UserActivity userActivity = modelMapper.map(userActivityDTO, UserActivity.class);
        return this.userActivityService.recordActivity(userActivity);
    }

    @GetMapping("/get-all-activities")
    public List<UserActivity> getAll() {
        return userActivityService.getAllUserActivities();
    }
}
