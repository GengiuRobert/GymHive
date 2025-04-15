package com.example.gymhive.controller;

import com.example.gymhive.dto.SubCategoryDTO;
import com.example.gymhive.entity.SubCategory;
import com.example.gymhive.service.SubCategoryService;
import org.modelmapper.ModelMapper;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/subcategories")
@CrossOrigin(origins = "http://localhost:4200")
public class SubCategoryController {

    private final SubCategoryService subCategoryService;
    private final ModelMapper modelMapper;

    public SubCategoryController(SubCategoryService subCategoryService, ModelMapper modelMapper) {
        this.subCategoryService = subCategoryService;
        this.modelMapper = modelMapper;
    }

    @PostMapping("/add-subcategory")
    @ResponseBody
    public String addCategory(@Valid @RequestBody SubCategoryDTO subCategoryDTO) {
        SubCategory subCategory = modelMapper.map(subCategoryDTO, SubCategory.class);
        return this.subCategoryService.addSubCategory(subCategory);
    }

    @DeleteMapping("/delete-subcategory-by-id/{subCategoryId}")
    @ResponseBody
    public String deleteSubCategory(@PathVariable("subCategoryId") String subCategoryId) { return this.subCategoryService.deleteSubCategory(subCategoryId); }

    @PutMapping("/update-subcategory-by-id/{subCategoryId}")
    @ResponseBody
    public String updateSubCategoryById(@PathVariable("subCategoryId") String subCategoryId, @RequestBody SubCategory updatedSubCategory) { return this.subCategoryService.updateSubCategory(subCategoryId,updatedSubCategory); }

    @GetMapping("/get-all-subcategories")
    @ResponseBody
    public List<SubCategory> getAllSubCategories() { return this.subCategoryService.getAllSubCategories(); }

}
