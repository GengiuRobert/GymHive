package repository;

import com.example.gymhive.entity.Product;
import com.example.gymhive.repository.ProductRepository;
import com.example.gymhive.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product product;

    @BeforeEach
    void setUp() {
        product = new Product();
        product.setProductId("123");
        product.setName("Test Product");
        product.setDescription("Test Description");
        product.setPrice(100.0);
    }

    @Test
    void testAddProduct() {
        when(productRepository.save(product)).thenReturn("product saved");

        String result = productService.addProduct(product);
        assertEquals("product saved", result, "expected service to return 'product saved'");
        verify(productRepository, times(1)).save(product);
    }

    @Test
    void testDeleteProduct() {
        when(productRepository.delete("123")).thenReturn("product deleted");

        String result = productService.deleteProduct("123");
        assertEquals("product deleted", result, "expected service to return 'product deleted'");
        verify(productRepository, times(1)).delete("123");
    }

    @Test
    void testUpdateProduct() {
        when(productRepository.update(eq("123"), any(Product.class)))
                .thenReturn("product updated");

        String result = productService.updateProduct("123", product);
        assertEquals("product updated", result, "expected service to return 'product updated'");
        verify(productRepository, times(1)).update("123", product);
    }

    @Test
    void testGetAllProducts() {
        Product p1 = new Product("101", "P1", "Desc1", 10.0,"Category1");
        Product p2 = new Product("102", "P2", "Desc2", 20.0,"Category1");
        List<Product> mockList = Arrays.asList(p1, p2);

        when(productRepository.getAll()).thenReturn(mockList);

        List<Product> result = productService.getAllProducts();
        assertEquals(2, result.size(), "expected to get 2 products");
        assertEquals("P1", result.get(0).getName(), "expected first product name to be 'P1'");
        verify(productRepository, times(1)).getAll();
    }

}
