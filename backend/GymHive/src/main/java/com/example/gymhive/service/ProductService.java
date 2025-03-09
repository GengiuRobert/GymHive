package com.example.gymhive.service;

import com.example.gymhive.entity.Product;
import com.example.gymhive.repository.ProductRepository;
import org.springframework.stereotype.Service;


@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService (ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public String addProduct(Product product) {
       return productRepository.save(product);
    }

    public String deleteProduct(String productId) { return productRepository.delete(productId); }
}
