package com.example.gymhive.service;

import com.example.gymhive.entity.Category;
import com.example.gymhive.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public String addCategory(Category category) {
        Category existingCategory = categoryRepository.findCategoryByName(category.getCategoryName());
        if (existingCategory != null) {
            throw new IllegalArgumentException("category with that name already exists");
        }

        return categoryRepository.save(category);
    }

    public String deleteCategory(String categoryId) {
        if (categoryId == null || categoryId.trim().isEmpty()) {
            throw new IllegalArgumentException("category ID cannot be null or empty");
        }

        return categoryRepository.delete(categoryId);
    }

    public String updateCategory(String categoryId, Category updatedCategory) {

        if (categoryId == null || categoryId.trim().isEmpty()) {
            throw new IllegalArgumentException("category ID cannot be null or empty");
        }
        if (updatedCategory == null) {
            throw new IllegalArgumentException("updated category cannot be null");
        }

        return categoryRepository.update(categoryId,updatedCategory); }

    public List<Category> getAllCategories() { return categoryRepository.getAll(); }
}
