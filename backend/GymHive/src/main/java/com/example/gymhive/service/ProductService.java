package com.example.gymhive.service;

import com.example.gymhive.entity.Product;
import com.example.gymhive.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final WebSocketNotificationService webSocketNotificationService;

    public ProductService (ProductRepository productRepository, WebSocketNotificationService webSocketNotificationService) {
        this.productRepository = productRepository;
        this.webSocketNotificationService = webSocketNotificationService;
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

        Product existingProduct = productRepository.findById(productId);

        double oldPrice = existingProduct.getPrice();

        existingProduct.setName(updatedProduct.getName());
        existingProduct.setDescription(updatedProduct.getDescription());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setCategoryId(updatedProduct.getCategoryId());
        existingProduct.setSubCategoryId(updatedProduct.getSubCategoryId());
        existingProduct.setImageUrl(updatedProduct.getImageUrl());

        productRepository.update(productId,existingProduct);

        Product newUpdatedProduct = productRepository.findById(productId);

        if(oldPrice != newUpdatedProduct.getPrice()){

            Product oldProduct = new Product();
            oldProduct.setName(existingProduct.getName());
            oldProduct.setProductId(existingProduct.getProductId());
            oldProduct.setPrice(oldPrice);

            webSocketNotificationService.notifyPriceChange(oldProduct, newUpdatedProduct);
        }

        return "product updated successfully SERVICE";
    }

    public Product getProductById(String productId) {
        if (productId == null || productId.trim().isEmpty()) {
            throw new IllegalArgumentException("Product ID cannot be null or empty");
        }
        return productRepository.findById(productId);
    }

    public List<Product> getAllProducts() { return productRepository.getAll(); }
}
