package com.example.gymhive.controller;

import com.example.gymhive.dto.WishListDTO;
import com.example.gymhive.entity.Product;
import com.example.gymhive.entity.WishList;
import com.example.gymhive.service.WishListService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/wishlists")
@CrossOrigin(origins = "http://localhost:4200")
public class WishListController {

    private final WishListService wishListService;
    private final ModelMapper modelMapper;

    @Autowired
    public WishListController(WishListService wishListService, ModelMapper modelMapper) {
        this.wishListService = wishListService;
        this.modelMapper = modelMapper;
    }

    @PostMapping("/add-wishlist")
    @ResponseBody
    public String addShoppingCart(@Valid @RequestBody WishListDTO wishListDTO) {
        WishList wishList = modelMapper.map(wishListDTO, WishList.class);
        return this.wishListService.addWishList(wishList);
    }

    @DeleteMapping("/delete-wishlist-by-id/{wishListId}")
    @ResponseBody
    public String deleteShoppingCart(@PathVariable String wishListId) {
        return this.wishListService.deleteWishList(wishListId);
    }

    @GetMapping("/get-wishlist-by-id/{wishListId}")
    @ResponseBody
    public WishList getByWishlistId(@PathVariable String wishListId) {
        return this.wishListService.getWishListByWishListId(wishListId);
    }

    @GetMapping("/get-wishlist-by-user-id/{userId}")
    @ResponseBody
    public WishList getByUserId(@PathVariable String userId) {
        return this.wishListService.getWishListByUserId(userId);
    }

    @PutMapping("/add-product/{wishListId}")
    @ResponseBody
    public WishList addProductToWishList(
            @PathVariable String wishListId,
            @RequestBody Product product
    ) {
        return wishListService.addProductToWishList(wishListId, product);
    }

    @DeleteMapping("/remove-product/{wishListId}/{productId}")
    @ResponseBody
    public WishList removeProductFromWishList(@PathVariable String wishListId, @PathVariable String productId) {
        return wishListService.removeProductFromWishList(wishListId, productId);
    }

}
