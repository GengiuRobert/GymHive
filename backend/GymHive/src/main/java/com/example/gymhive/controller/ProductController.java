package com.example.gymhive.controller;

import com.example.gymhive.entity.Product;
import com.example.gymhive.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping("/add-product")
    @ResponseBody
    public String addProduct(@RequestBody Product product) {
        return this.productService.addProduct(product);
    }

    @DeleteMapping("/delete-product-by-id/{productId}")
    @ResponseBody
    public String deleteProduct(@PathVariable("productId") String productId) { return this.productService.deleteProduct(productId); }

    @PutMapping("/update-product-by-id/{productId}")
    @ResponseBody
    public String updateProductById(@PathVariable("productId") String productId, @RequestBody Product updatedProduct) { return this.productService.updateProduct(productId,updatedProduct); }

    @GetMapping("/get-all-products")
    @ResponseBody
    public List<Product> getAllProducts() { return this.productService.getAllProducts(); }
}
