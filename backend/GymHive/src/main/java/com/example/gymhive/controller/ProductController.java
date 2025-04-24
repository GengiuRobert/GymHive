package com.example.gymhive.controller;

import com.example.gymhive.dto.ProductDTO;
import com.example.gymhive.entity.Product;
import com.example.gymhive.service.ProductService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;


@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductController {

    private final ProductService productService;
    private final ModelMapper modelMapper;

    @Autowired
    public ProductController(ProductService productService, ModelMapper modelMapper) {
        this.productService = productService;
        this.modelMapper = modelMapper;
    }

    @PostMapping("/add-product")
    @ResponseBody
    public String addProduct(@Valid @RequestBody ProductDTO productDTO) {
        Product product = modelMapper.map(productDTO, Product.class);
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

    @GetMapping("/get-product-by-id/{productId}")
    public ResponseEntity<Product> getProductById(
            @PathVariable("productId") String productId) {

        Product product = productService.getProductById(productId);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(product);
    }
}
