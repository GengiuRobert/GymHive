package com.example.gymhive.service;

import com.example.gymhive.entity.Product;
import com.example.gymhive.entity.WishList;
import com.example.gymhive.repository.WishListRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.HashMap;
import java.util.Map;

@Service
public class WebSocketNotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    private final WishListRepository wishListRepository;

    private final ObjectMapper objectMapper;

    public WebSocketNotificationService(SimpMessagingTemplate messagingTemplate, WishListRepository wishListRepository, ObjectMapper objectMapper) {
        this.messagingTemplate = messagingTemplate;
        this.wishListRepository = wishListRepository;
        this.objectMapper = objectMapper;
    }

    public void notifyPriceChange(Product oldProduct, Product updatedProduct) {

        System.out.println("notifyPriceChange called: old price = " + oldProduct.getPrice() + ", new price = " + updatedProduct.getPrice());

        if (!Objects.equals(oldProduct.getPrice(), updatedProduct.getPrice())) {

            System.out.println("Price has changed, finding affected wishlists for product: " + updatedProduct.getProductId());

            try {

                //find all wishlists containing this product
                List<WishList> affectedWishlists = wishListRepository.findByFavoriteProductsProductIdContains(updatedProduct.getProductId());
                System.out.println("Found " + affectedWishlists.size() + " affected wishlists");

                for (WishList wishlist : affectedWishlists) {

                    System.out.println("Sending notification to user: " + wishlist.getUserId());

                    //notification payload
                    Map<String, Object> notification = new HashMap<>();
                    notification.put("type", "PRICE_CHANGE");
                    notification.put("userId", wishlist.getUserId());
                    notification.put("productId", updatedProduct.getProductId());
                    notification.put("productName", updatedProduct.getName());
                    notification.put("oldPrice", oldProduct.getPrice());
                    notification.put("newPrice", updatedProduct.getPrice());
                    notification.put("imageUrl", updatedProduct.getImageUrl());
                    notification.put("timestamp", System.currentTimeMillis());

                    //discount percentage
                    double discountPercentage = ((oldProduct.getPrice() - updatedProduct.getPrice()) / oldProduct.getPrice()) * 100;
                    notification.put("discountPercentage", Math.round(discountPercentage));

                    String message = objectMapper.writeValueAsString(notification);

                    // Send to user-specific topic
                    messagingTemplate.convertAndSend("/topic/user/" + wishlist.getUserId() + "/notifications", message);
                    System.out.println("Notification sent to user-specific topic: /topic/user/" + wishlist.getUserId() + "/notifications");


                    // Also send to general topic for admin monitoring
                    messagingTemplate.convertAndSend("/topic/notifications", message);
                    System.out.println("Notification sent to general topic: /topic/notifications");
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}

