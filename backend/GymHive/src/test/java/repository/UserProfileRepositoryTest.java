package repository;

import com.example.gymhive.entity.UserProfile;
import com.example.gymhive.repository.UserProfileRepository;
import com.example.gymhive.service.FirestoreService;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;


import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class UserProfileRepositoryTest {

    @Mock
    private FirestoreService firestoreService;

    @Mock
    private CollectionReference profiles;

    @Mock
    private DocumentReference documentReference;

    @Mock
    private ApiFuture<QuerySnapshot> queryFuture;

    @Mock
    private QuerySnapshot querySnapshot;

    @Mock
    private Query query;

    @InjectMocks
    private UserProfileRepository userProfileRepository;

    private UserProfile userProfile;

    @BeforeEach
    void setUp() {
        userProfile = new UserProfile("123", "user1", "John", "Doe", "123456789", null);
        lenient().when(firestoreService.getCollection("userProfiles")).thenReturn(profiles);
    }

    @Test
    void testSave() {
        when(profiles.document()).thenReturn(documentReference);
        when(documentReference.getId()).thenReturn("generatedId");

        String result = userProfileRepository.save(userProfile);

        assertEquals("userProfile saved", result);
        assertEquals("generatedId", userProfile.getUserProfileId(),
                "should return the generated user profile id");

        verify(profiles, times(1)).document();
        verify(documentReference, times(1)).set(userProfile);
    }

    @Test
    void testDelete() {
        when(profiles.document("123")).thenReturn(documentReference);

        String result = userProfileRepository.delete("123");
        assertEquals("userProfile deleted", result);

        verify(documentReference, times(1)).delete();
    }

    @Test
    void testUpdate() {
        when(profiles.document("123")).thenReturn(documentReference);

        UserProfile updatedProfile = new UserProfile("123", "user1", "Jane", "Doe", "987654321", null);

        String result = userProfileRepository.update("123", updatedProfile);
        assertEquals("userProfile updated", result);

        verify(documentReference, times(1)).update(anyMap());
    }

    @Test
    void testUpdate_withNullId() {
        Exception ex = assertThrows(IllegalArgumentException.class, () ->
                userProfileRepository.update("", userProfile)
        );
        assertEquals("userProfile ID must not be null or empty", ex.getMessage());
    }

}
