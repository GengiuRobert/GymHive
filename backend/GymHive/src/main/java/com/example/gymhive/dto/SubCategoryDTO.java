package com.example.gymhive.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubCategoryDTO {

    @NotBlank(message = "SubCategory name cannot be null or empty")
    @NotNull
    private String subCategoryName;

    @NotBlank(message = "ParentCategory id cannot be null or empty")
    @NotNull
    private String parentCategoryId;
}
