package com.example.gymhive.controller;

import com.example.gymhive.entity.Product;
import com.example.gymhive.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping("/addProduct")
    @ResponseBody
    public String addProduct(@RequestBody Product product) {
        return this.productService.addProduct(product);
    }

    @DeleteMapping("/deleteProduct")
    public String deleteProduct(@RequestParam("productId") String productId) {
        return productService.deleteProduct(productId);
    }
}
