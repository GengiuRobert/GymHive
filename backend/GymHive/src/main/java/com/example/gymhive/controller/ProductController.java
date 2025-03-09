package com.example.gymhive.controller;

import com.example.gymhive.entity.Product;
import com.example.gymhive.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


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

    @DeleteMapping("/deleteProductById")
    @ResponseBody
    public String deleteProduct(@RequestParam("productId") String productId) { return this.productService.deleteProduct(productId); }

    @PutMapping("/updateProductById")
    @ResponseBody
    public String updateProductById(@RequestParam("productId") String productId, @RequestBody Product updatedProduct) { return this.productService.updateProduct(productId,updatedProduct); }

    @GetMapping("/getAllProducts")
    @ResponseBody
    public List<Product> getAllProducts() { return this.productService.getAllProducts(); }
}
