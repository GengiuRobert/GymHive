package com.example.gymhive.controller;

import com.example.gymhive.dto.ShoppingCartDTO;
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

    @PostMapping("/add-shoppingcart")
    @ResponseBody
    public String addShoppingCart(@Valid @RequestBody ShoppingCartDTO shoppingCartDTO) {
        ShoppingCart shoppingCart = modelMapper.map(shoppingCartDTO, ShoppingCart.class);
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
