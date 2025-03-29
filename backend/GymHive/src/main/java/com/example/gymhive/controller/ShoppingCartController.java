package com.example.gymhive.controller;

import com.example.gymhive.entity.ShoppingCart;
import com.example.gymhive.service.ShoppingCartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shopping-cart")
@CrossOrigin(origins = "http://localhost:4200")
public class ShoppingCartController {

    private final ShoppingCartService shoppingCartService;

    @Autowired
    public ShoppingCartController(ShoppingCartService shoppingCartService) {
        this.shoppingCartService = shoppingCartService;
    }

    @PostMapping("/add-shoppingcart")
    @ResponseBody
    public String addShoppingCart(@RequestBody ShoppingCart shoppingCart) {
        return this.shoppingCartService.addShoppingCart(shoppingCart);
    }

    @DeleteMapping("/delete-shoppingcart-by-id/{shoppingCartId}")
    @ResponseBody
    public String deleteShoppingCart(@PathVariable String shoppingCartId) {
        return this.shoppingCartService.deleteShoppingCart(shoppingCartId);
    }

    @PutMapping("/update-shoppingcart-by-id/{shoppingCartId}")
    @ResponseBody
    public String updateShoppingCartById(@PathVariable("shoppingCartId") String shoppingCartId,@RequestBody ShoppingCart updatedShoppingCart) {
        return this.shoppingCartService.updateShoppingCart(shoppingCartId,updatedShoppingCart);
    }

    @GetMapping("/get-all-shoppingcarts")
    @ResponseBody
    public List<ShoppingCart> getAllShoppingCarts() {
        return this.shoppingCartService.getAllShoppingCarts();
    }

}
