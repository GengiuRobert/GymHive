package com.example.gymhive.service;

import com.example.gymhive.entity.Product;
import com.example.gymhive.entity.ShoppingCart;
import com.example.gymhive.entity.WishList;
import com.example.gymhive.repository.WishListRepository;
import org.springframework.stereotype.Service;

@Service
public class WishListService {

    private final WishListRepository wishListRepository;

    public WishListService(WishListRepository wishListRepository) {
        this.wishListRepository = wishListRepository;
    }

    public String addWishList(WishList wishList) {

        return wishListRepository.save(wishList);
    }

    public String deleteWishList(String wishListId) {
        if(wishListId == null || wishListId.trim().isEmpty()){
            throw new IllegalArgumentException("wishListId cannot be null or empty");
        }
        return wishListRepository.delete(wishListId);
    }

    public String updateWishList(String wishListId,WishList updatedWishList) {
        if(wishListId == null || wishListId.trim().isEmpty()){
            throw new IllegalArgumentException("wishListId cannot be null or empty");
        }
        if(updatedWishList == null){
            throw new IllegalArgumentException("updatedWishList cannot be null");
        }

        return wishListRepository.update(wishListId, updatedWishList);
    }

    public WishList addProductToWishList(String wishListId, Product product) {
        WishList wishList = wishListRepository.getWishListById(wishListId);

        if (wishList == null) throw new IllegalArgumentException("No list");

        wishList.addProduct(product);

        wishListRepository.update(wishListId, wishList);

        return wishList;
    }

    public WishList removeProductFromWishList(String wishListId, String productId) {
        WishList wishList = wishListRepository.getWishListById(wishListId);

        if (wishList == null) throw new IllegalArgumentException("No list");

        wishList.removeProduct(productId);

        wishListRepository.update(wishListId, wishList);

        return wishList;
    }

    public WishList getWishListByWishListId(String wishListId) {
        return wishListRepository.getWishListById(wishListId);
    }

    public WishList getWishListByUserId(String userId) {
        return wishListRepository.getWishListByUserId(userId);
    }
}
