package com.example.gymhive.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubCategory {
    private String subCategoryId;
    private String subCategoryName;
    private String parentCategoryId;
}
