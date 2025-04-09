package com.example.gymhive.controller;

import com.example.gymhive.dto.CategoryDTO;
import com.example.gymhive.entity.Category;
import com.example.gymhive.service.CategoryService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/categories")
@CrossOrigin(origins = "http://localhost:4200")
public class CategoryController {

    private final CategoryService categoryService;
    private final ModelMapper modelMapper;

    @Autowired
    public CategoryController(CategoryService categoryService, ModelMapper modelMapper) {
        this.categoryService = categoryService;
        this.modelMapper = modelMapper;
    }

    @PostMapping("/add-category")
    @ResponseBody
    public String addCategory(@Valid @RequestBody CategoryDTO categoryDTO) {
        Category category = modelMapper.map(categoryDTO, Category.class);
        return this.categoryService.addCategory(category);
    }

    @DeleteMapping("/delete-category-by-id/{categoryId}")
    @ResponseBody
    public String deleteCategory(@PathVariable("categoryId") String categoryId) { return this.categoryService.deleteCategory(categoryId); }

    @PutMapping("/update-category-by-id/{categoryId}")
    @ResponseBody
    public String updateCategoryById(@PathVariable("categoryId") String categoryId, @RequestBody Category updatedCategory) { return this.categoryService.updateCategory(categoryId,updatedCategory); }

    @GetMapping("/get-all-categories")
    @ResponseBody
    public List<Category> getAllCategories() { return this.categoryService.getAllCategories(); }
}
