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

        if (product == null) {
            throw new IllegalArgumentException("product cannot be null");
        }
        if (product.getName() == null || product.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("product name cannot be null or empty");
        }
        if (product.getDescription() == null || product.getDescription().trim().isEmpty()) {
            throw new IllegalArgumentException("product description cannot be null or empty");
        }
        if (product.getPrice() == null || product.getPrice() <= 0) {
            throw new IllegalArgumentException("product price must be greater than 0");
        }

        Product existingProduct = productRepository.findOneByAllFields(
                product.getName(),
                product.getDescription(),
                product.getPrice()
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
