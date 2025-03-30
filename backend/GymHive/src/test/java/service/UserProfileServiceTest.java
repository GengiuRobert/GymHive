package service;

import com.example.gymhive.entity.UserProfile;
import com.example.gymhive.repository.UserProfileRepository;
import com.example.gymhive.service.UserProfileService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UserProfileServiceTest {

    @Mock
    private UserProfileRepository userProfileRepository;

    @InjectMocks
    private UserProfileService userProfileService;

    private UserProfile userProfile;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        userProfile = new UserProfile("123", "user1", "John", "Doe", "123456789", null);
    }

    @Test
    void testAddUserProfile() {
        when(userProfileRepository.findByUserId("user1")).thenReturn(null);
        when(userProfileRepository.save(userProfile)).thenReturn("userProfile saved");

        String result = userProfileService.addUserProfile(userProfile);

        assertEquals("userProfile saved", result);
        verify(userProfileRepository, times(1)).save(userProfile);
    }

    @Test
    void testAddUserProfileAlreadyExists() {
        when(userProfileRepository.findByUserId("user1")).thenReturn(userProfile);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                userProfileService.addUserProfile(userProfile)
        );
        assertEquals("userProfile with that ID already exists", exception.getMessage());
    }

    @Test
    void testDeleteUserProfile() {
        when(userProfileRepository.delete("123")).thenReturn("userProfile deleted");

        String result = userProfileService.deleteUserProfile("123");

        assertEquals("userProfile deleted", result);
        verify(userProfileRepository, times(1)).delete("123");
    }

    @Test
    void testDeleteUserProfileWithNullId() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                userProfileService.deleteUserProfile(null)
        );
        assertEquals("userProfile ID cannot be null or empty", exception.getMessage());
    }

    @Test
    void testUpdateUserProfile() {
        UserProfile updatedUserProfile = new UserProfile("123", "user1", "Jane", "Doe", "987654321", null);
        when(userProfileRepository.update(eq("123"), any(UserProfile.class))).thenReturn("userProfile updated");

        String result = userProfileService.updateUserProfile("123", updatedUserProfile);

        assertEquals("userProfile updated", result);
        verify(userProfileRepository, times(1)).update("123", updatedUserProfile);
    }

    @Test
    void testUpdateUserProfileWithNullId() {
        UserProfile updatedUserProfile = new UserProfile("123", "user1", "Jane", "Doe", "987654321", null);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                userProfileService.updateUserProfile(null, updatedUserProfile)
        );
        assertEquals("userProfile ID cannot be null or empty", exception.getMessage());
    }

    @Test
    void testGetAllUserProfiles() {
        UserProfile userProfile1 = new UserProfile("101", "user2", "Alice", "Smith", "555555555", null);
        UserProfile userProfile2 = new UserProfile("102", "user3", "Bob", "Brown", "666666666", null);
        List<UserProfile> mockList = Arrays.asList(userProfile1, userProfile2);

        when(userProfileRepository.getAll()).thenReturn(mockList);

        List<UserProfile> result = userProfileService.getAllUserProfiles();

        assertEquals(2, result.size(), "expected to get 2 user profiles");
        assertEquals("Alice", result.get(0).getFirstName(), "expected first user's name to be 'Alice'");
        verify(userProfileRepository, times(1)).getAll();
    }
}
