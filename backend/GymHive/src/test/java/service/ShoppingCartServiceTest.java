package service;

import com.example.gymhive.entity.Product;
import com.example.gymhive.entity.ShoppingCart;
import com.example.gymhive.repository.ShoppingCartRepository;
import com.example.gymhive.service.ShoppingCartService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ShoppingCartServiceTest {

    @Mock
    private ShoppingCartRepository shoppingCartRepository;

    @InjectMocks
    private ShoppingCartService shoppingCartService;

    private ShoppingCart shoppingCart;

    @BeforeEach
    void setUp() {
        shoppingCart = new ShoppingCart("123", "user1", "user1@example.com", null, 0.0, 0);
    }

    @Test
    void testAddShoppingCart() {
        when(shoppingCartRepository.save(shoppingCart)).thenReturn("shoppingCart saved");

        shoppingCart.setProducts(Map.of(new Product("1", "Product1", "Description", 50.0, "Category1","SubCategory1","imageUrl1"),1));
        shoppingCart.setTotalPrice(shoppingCart.calculateTotalPrice());
        shoppingCart.setTotalItems(shoppingCart.calculateTotalItems());

        String result = shoppingCartService.addShoppingCart(shoppingCart);
        assertEquals("shoppingCart saved", result, "expected service to return 'shoppingCart saved'");
        verify(shoppingCartRepository, times(1)).save(shoppingCart);
    }

    @Test
    void testDeleteShoppingCart() {
        when(shoppingCartRepository.delete("123")).thenReturn("shoppingCart deleted");

        String result = shoppingCartService.deleteShoppingCart("123");
        assertEquals("shoppingCart deleted", result, "expected service to return 'shoppingCart deleted'");
        verify(shoppingCartRepository, times(1)).delete("123");
    }

    @Test
    void testUpdateShoppingCart() {
        shoppingCart.setProducts(Map.of(new Product("1", "Updated Product", "Updated Desc", 100.0, "Updated Category","Updated SubCategory1","imageUrl1"),1));
        shoppingCart.setTotalPrice(shoppingCart.calculateTotalPrice());
        shoppingCart.setTotalItems(shoppingCart.getProducts().size());

        when(shoppingCartRepository.update(eq("123"), any(ShoppingCart.class)))
                .thenReturn("shoppingCart updated");

        String result = shoppingCartService.updateShoppingCart("123", shoppingCart);
        assertEquals("shoppingCart updated", result, "expected service to return 'shoppingCart updated'");
        verify(shoppingCartRepository, times(1)).update("123", shoppingCart);
    }

    @Test
    void testGetAllShoppingCarts() {
        ShoppingCart sc1 = new ShoppingCart("123", "user1", "user1@example.com", Map.of(new Product("1", "Product1", "Desc1", 10.0, "Category1","SubCategory1","imageUrl1"),1), 100.0, 2);
        ShoppingCart sc2 = new ShoppingCart("124", "user2", "user2@example.com", Map.of(new Product("2", "Product2", "Desc2", 20.0, "Category2","SubCategory1","imageUrl1"),1), 50.0, 1);
        when(shoppingCartRepository.getAll()).thenReturn(Arrays.asList(sc1, sc2));

        List<ShoppingCart> result = shoppingCartService.getAllShoppingCarts();
        assertEquals(2, result.size(), "expected to get 2 shopping carts");
        verify(shoppingCartRepository, times(1)).getAll();
    }

    @Test
    void testAddShoppingCartWithNull() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                shoppingCartService.addShoppingCart(null)
        );
        assertEquals("shoppingCart cannot be null", ex.getMessage());
    }

}
