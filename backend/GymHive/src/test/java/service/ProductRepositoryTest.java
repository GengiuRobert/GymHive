package service;

import com.example.gymhive.entity.Product;
import com.example.gymhive.repository.ProductRepository;
import com.example.gymhive.service.FirestoreService;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)

public class ProductRepositoryTest {

    @Mock
    private FirestoreService firestoreService;

    @Mock
    private CollectionReference collectionReference;

    @Mock
    private DocumentReference documentReference;

    @Mock
    private ApiFuture<QuerySnapshot> queryFuture;

    @Mock
    private QuerySnapshot querySnapshot;

    @InjectMocks
    private ProductRepository productRepository;

    private Product product;

    @BeforeEach
    void setUp() {
        product = new Product();
        product.setName("Mock Product");
        product.setDescription("Mock Desc");
        product.setPrice(50.0);

        lenient().when(firestoreService.getCollection("products")).thenReturn(collectionReference);
    }

    @Test
    void testSave() {
        when(collectionReference.document()).thenReturn(documentReference);
        when(documentReference.getId()).thenReturn("generatedId");

        String result = productRepository.save(product);

        assertEquals("product saved", result);
        assertEquals("generatedId", product.getProductId(),
                "should return the generated product id");

        verify(collectionReference, times(1)).document();
        verify(documentReference, times(1)).set(product);
    }

    @Test
    void testDelete() {
        when(collectionReference.document("123")).thenReturn(documentReference);

        String result = productRepository.delete("123");
        assertEquals("product deleted", result);

        verify(documentReference, times(1)).delete();
    }

    @Test
    void testUpdate() {
        when(collectionReference.document("123")).thenReturn(documentReference);

        Product updated = new Product();
        updated.setName("UpdatedName");
        updated.setPrice(99.99);

        String result = productRepository.update("123", updated);
        assertEquals("product updated", result);

        verify(documentReference, times(1)).update(anyMap());
    }

    @Test
    void testUpdate_withNullId() {
        Exception ex = assertThrows(IllegalArgumentException.class, () ->
                productRepository.update("", product)
        );
        assertEquals("Product ID must not be null or empty", ex.getMessage());
    }

    @Test
    void testGetAll() throws ExecutionException, InterruptedException {
        when(collectionReference.get()).thenReturn(queryFuture);
        when(queryFuture.get()).thenReturn(querySnapshot);

        QueryDocumentSnapshot doc1 = mock(QueryDocumentSnapshot.class);
        QueryDocumentSnapshot doc2 = mock(QueryDocumentSnapshot.class);

        Product p1 = new Product("abc", "Name1", "Desc1", 10.0);
        Product p2 = new Product("xyz", "Name2", "Desc2", 20.0);

        when(doc1.toObject(Product.class)).thenReturn(p1);
        when(doc2.toObject(Product.class)).thenReturn(p2);

        List<QueryDocumentSnapshot> docSnapshots = new ArrayList<>();
        docSnapshots.add(doc1);
        docSnapshots.add(doc2);

        when(querySnapshot.getDocuments()).thenReturn(docSnapshots);

        List<Product> result = productRepository.getAll();
        assertEquals(2, result.size(), "should return 2 products");
        assertEquals("Name1", result.get(0).getName());
        assertEquals("Name2", result.get(1).getName());
    }


}
