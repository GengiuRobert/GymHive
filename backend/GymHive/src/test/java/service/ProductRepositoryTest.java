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

    @Mock
    private Query query;

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
        assertEquals("product ID must not be null or empty", ex.getMessage());
    }

    @Test
    void testGetAll() throws ExecutionException, InterruptedException {
        when(collectionReference.get()).thenReturn(queryFuture);
        when(queryFuture.get()).thenReturn(querySnapshot);

        QueryDocumentSnapshot doc1 = mock(QueryDocumentSnapshot.class);
        QueryDocumentSnapshot doc2 = mock(QueryDocumentSnapshot.class);

        Product p1 = new Product("abc", "Name1", "Desc1", 10.0,"Category1");
        Product p2 = new Product("xyz", "Name2", "Desc2", 20.0,"Category2");

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

    @Test
    void testFindOneByAllFieldsFound() throws ExecutionException, InterruptedException {
        Product expectedProduct = new Product("id123", "Test Product", "Test Description",100.0, "Test Category");

        when(collectionReference.whereEqualTo("name", expectedProduct.getName())).thenReturn(query);
        when(query.whereEqualTo("description", expectedProduct.getDescription())).thenReturn(query);
        when(query.whereEqualTo("price", expectedProduct.getPrice())).thenReturn(query);
        when(query.whereEqualTo("category", expectedProduct.getPrice())).thenReturn(query);
        when(query.limit(1)).thenReturn(query);
        when(query.get()).thenReturn(queryFuture);
        when(queryFuture.get()).thenReturn(querySnapshot);

        List<QueryDocumentSnapshot> docList = new ArrayList<>();
        QueryDocumentSnapshot docSnapshot = mock(QueryDocumentSnapshot.class);
        docList.add(docSnapshot);
        when(querySnapshot.getDocuments()).thenReturn(docList);
        when(docSnapshot.toObject(Product.class)).thenReturn(expectedProduct);

        Product result = productRepository.findOneByAllFields(expectedProduct.getName(), expectedProduct.getDescription(), expectedProduct.getPrice(),expectedProduct.getCategory());
        assertNotNull(result, "Expected a product to be returned");
        assertEquals(expectedProduct.getName(), result.getName(), "Product name should match");
        assertEquals(expectedProduct.getDescription(), result.getDescription(), "Product description should match");
        assertEquals(expectedProduct.getPrice(), result.getPrice(), "Product price should match");
    }

    @Test
    void testFindOneByAllFieldsNotFound() throws ExecutionException, InterruptedException {
        when(collectionReference.whereEqualTo(anyString(), any())).thenReturn(query);
        when(query.whereEqualTo(anyString(), any())).thenReturn(query);
        when(query.whereEqualTo(anyString(), any())).thenReturn(query);
        when(query.limit(1)).thenReturn(query);
        when(query.get()).thenReturn(queryFuture);
        when(queryFuture.get()).thenReturn(querySnapshot);
        when(querySnapshot.getDocuments()).thenReturn(new ArrayList<>());

        Product result = productRepository.findOneByAllFields("NonExistent", "No Desc", 0.0,"No Category");
        assertNull(result, "Expected null when no product is found");
    }

}
