package com.example.gymhive.controller;

import com.example.gymhive.dto.ShoppingCartDTO;
import com.example.gymhive.entity.Product;
import com.example.gymhive.entity.ShoppingCart;
import com.example.gymhive.service.ShoppingCartService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/shopping-cart")
@CrossOrigin(origins = "http://localhost:4200")
public class ShoppingCartController {

    private final ShoppingCartService shoppingCartService;
    private final ModelMapper modelMapper;

    @Autowired
    public ShoppingCartController(ShoppingCartService shoppingCartService, ModelMapper modelMapper) {
        this.shoppingCartService = shoppingCartService;
        this.modelMapper = modelMapper;
    }

    @PostMapping("/add-shopping-cart")
    @ResponseBody
    public String addShoppingCart(@Valid @RequestBody ShoppingCartDTO shoppingCartDTO) {
        ShoppingCart shoppingCart = modelMapper.map(shoppingCartDTO, ShoppingCart.class);
        return this.shoppingCartService.addShoppingCart(shoppingCart);
    }

    @DeleteMapping("/delete-shopping-cart-by-id/{shoppingCartId}")
    @ResponseBody
    public String deleteShoppingCart(@PathVariable String shoppingCartId) {
        return this.shoppingCartService.deleteShoppingCart(shoppingCartId);
    }

    @PutMapping("/update-shopping-cart-by-id/{shoppingCartId}")
    @ResponseBody
    public String updateShoppingCartById(@PathVariable("shoppingCartId") String shoppingCartId,@RequestBody ShoppingCart updatedShoppingCart) {
        return this.shoppingCartService.updateShoppingCart(shoppingCartId,updatedShoppingCart);
    }

    @PutMapping("/add-product/{shoppingCartId}")
    @ResponseBody
    public ShoppingCart addProductToCart(
            @PathVariable String shoppingCartId,
            @RequestBody Product product,
            @RequestParam(name = "quantity", defaultValue = "1") int quantity
    ) {
        return shoppingCartService.addProductToShoppingCart(shoppingCartId, product, quantity);
    }

    @DeleteMapping("/remove-product/{shoppingCartId}/{productId}")
    @ResponseBody
    public ShoppingCart removeProductFromCart(@PathVariable String shoppingCartId, @PathVariable String productId) {
        return shoppingCartService.removeProductFromShoppingCart(shoppingCartId, productId);
    }

    @DeleteMapping("/remove-all/{shoppingCartId}/{productId}")
    @ResponseBody
    public ShoppingCart removeAllOfProduct(
            @PathVariable String shoppingCartId,
            @PathVariable String productId
    ) {
        return shoppingCartService.removeAllOfProduct(shoppingCartId, productId);
    }

    @GetMapping("/get-all-shopping-carts")
    @ResponseBody
    public List<ShoppingCart> getAllShoppingCarts() {
        return this.shoppingCartService.getAllShoppingCarts();
    }

    @GetMapping("/get-shopping-cart-by-user-id/{userId}")
    @ResponseBody
    public ShoppingCart getShoppingCartByUserId(@PathVariable String userId) {
        return shoppingCartService.getShoppingCartByUserId(userId);
    }

}
