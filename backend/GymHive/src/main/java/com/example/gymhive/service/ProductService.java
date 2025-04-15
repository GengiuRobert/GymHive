package com.example.gymhive.service;

import com.example.gymhive.entity.Product;
import com.example.gymhive.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService (ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public String addProduct(Product product) {
        Product existingProduct = productRepository.findOneByAllFields(
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getCategoryId(),
                product.getSubCategoryId(),
                product.getImageUrl()
        );

        if (existingProduct != null) {
            throw new IllegalArgumentException("product with these details already exists");
        }

        return productRepository.save(product);
    }

    public String deleteProduct(String productId) {

        if (productId == null || productId.trim().isEmpty()) {
            throw new IllegalArgumentException("product ID cannot be null or empty");
        }

        return productRepository.delete(productId); }

    public String updateProduct(String productId, Product updatedProduct) {

        if (productId == null || productId.trim().isEmpty()) {
            throw new IllegalArgumentException("product ID cannot be null or empty");
        }
        if (updatedProduct == null) {
            throw new IllegalArgumentException("updated product cannot be null");
        }

        return productRepository.update(productId,updatedProduct); }

    public List<Product> getAllProducts() { return productRepository.getAll(); }
}
