package repository;

import com.example.gymhive.entity.Product;
import com.example.gymhive.entity.ShoppingCart;
import com.example.gymhive.repository.ShoppingCartRepository;
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
public class ShoppingCartRepositoryTest {

    @Mock
    private FirestoreService firestoreService;

    @Mock
    private CollectionReference collectionReference;

    @Mock
    private DocumentReference documentReference;

    @Mock
    private ApiFuture<QuerySnapshot> querySnapshotFuture;

    @Mock
    private QuerySnapshot querySnapshot;

    @InjectMocks
    private ShoppingCartRepository shoppingCartRepository;

    private ShoppingCart shoppingCart;

    private Product product;

    @BeforeEach
    void setUp() {

        product = new Product();
        product.setName("Mock Product");
        product.setDescription("Mock Desc");
        product.setPrice(50.0);

        shoppingCart = new ShoppingCart("1", "user1", "user1@example.com", List.of(product));
        lenient().when(firestoreService.getCollection("shoppingCarts")).thenReturn(collectionReference);
    }

    @Test
    void testSave() throws ExecutionException, InterruptedException{
        when(collectionReference.document()).thenReturn(documentReference);
        when(documentReference.getId()).thenReturn("generatedId");

        String result = shoppingCartRepository.save(shoppingCart);

        assertEquals("shoppingCart saved", result);

        assertEquals("shoppingCart saved", result);
        assertEquals("generatedId", shoppingCart.getShoppingCartId(),
                "should return the generated shoppingCart id");

        verify(collectionReference, times(1)).document();
        verify(documentReference, times(1)).set(shoppingCart);
    }

    @Test
    void testDelete() throws ExecutionException, InterruptedException {
        when(collectionReference.document("1")).thenReturn(documentReference);

        String result = shoppingCartRepository.delete("1");
        assertEquals("shoppingCart deleted", result);

        verify(documentReference, times(1)).delete();
    }

    @Test
    void testUpdate() {
        when(collectionReference.document("1")).thenReturn(documentReference);

        ShoppingCart updatedShoppingCart = new ShoppingCart();
        updatedShoppingCart.setUserEmail("user2@example.com");

        String result = shoppingCartRepository.update("1", updatedShoppingCart);

        assertEquals("shoppingCart updated", result);

        verify(documentReference, times(1)).update(any());
    }

    @Test
    void testGetAll() throws ExecutionException, InterruptedException {
        List<QueryDocumentSnapshot> docList = new ArrayList<>();
        QueryDocumentSnapshot doc1 = mock(QueryDocumentSnapshot.class);
        docList.add(doc1);

        when(collectionReference.get()).thenReturn(querySnapshotFuture);
        when(querySnapshotFuture.get()).thenReturn(querySnapshot);
        when(querySnapshot.getDocuments()).thenReturn(docList);

        List<ShoppingCart> result = shoppingCartRepository.getAll();
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(collectionReference, times(1)).get();
    }

}
