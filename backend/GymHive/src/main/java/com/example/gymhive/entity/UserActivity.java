package com.example.gymhive.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserActivity {
    private String activityId;
    private String userId;
    private String userEmail;
    private String timestamp;
    private String action;
}
