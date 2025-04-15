package com.example.gymhive.service;

import com.example.gymhive.entity.SubCategory;
import com.example.gymhive.repository.SubCategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubCategoryService {

    private final SubCategoryRepository subCategoryRepository;

    public SubCategoryService(SubCategoryRepository subCategoryRepository) {
        this.subCategoryRepository = subCategoryRepository;
    }

    public String addSubCategory(SubCategory subCategory) {
        SubCategory existingSubCategory = subCategoryRepository.findSubCategoryByNameAndParentId(subCategory.getSubCategoryName(),subCategory.getParentCategoryId());
        if (existingSubCategory != null) {
            throw new IllegalArgumentException("subCategory with that name already exists");
        }

        return subCategoryRepository.save(subCategory);
    }

    public String deleteSubCategory(String subCategoryId) {
        if (subCategoryId == null || subCategoryId.trim().isEmpty()) {
            throw new IllegalArgumentException("subCategory ID cannot be null or empty");
        }

        return subCategoryRepository.delete(subCategoryId);
    }

    public String updateSubCategory(String subCategoryId, SubCategory updatedSubCategory) {

        if (subCategoryId == null || subCategoryId.trim().isEmpty()) {
            throw new IllegalArgumentException("subCategory ID cannot be null or empty");
        }
        if (updatedSubCategory == null) {
            throw new IllegalArgumentException("updated subCategory cannot be null");
        }

        return subCategoryRepository.update(subCategoryId,updatedSubCategory); }

    public List<SubCategory> getAllSubCategories() { return subCategoryRepository.getAll(); }
}
