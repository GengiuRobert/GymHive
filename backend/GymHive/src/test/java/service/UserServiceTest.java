package service;

import com.example.gymhive.entity.AuthResponse;
import com.example.gymhive.entity.User;
import com.example.gymhive.repository.UserRepository;
import com.example.gymhive.service.UserService;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    private UserService userService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        userService = new UserService(userRepository);
    }

    @Test
    public void testSignUp() throws Exception {
        User user = new User("testUser", "test@example.com", "password123");

        AuthResponse mockResponse = new AuthResponse(
                "some_token",
                "test@example.com",
                "some_refresh_token",
                "3600",
                "12345"
        );

        when(userRepository.signUp(user)).thenReturn(mockResponse);

        AuthResponse response = userService.signUp(user);

        assertEquals(mockResponse.getIdToken(), response.getIdToken());
        assertEquals(mockResponse.getEmail(), response.getEmail());
        assertEquals(mockResponse.getRefreshToken(), response.getRefreshToken());
        assertEquals(mockResponse.getExpiresIn(), response.getExpiresIn());
        assertEquals(mockResponse.getLocalId(), response.getLocalId());
    }

    @Test
    public void testLogIn() {
        User user = new User("testUser", "test@example.com", "password123");
        String repoResponse = "Login successful! ID Token: some_token";
        try {
            when(userRepository.logIn(user)).thenReturn(repoResponse);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        String response = userService.logIn(user);
        assertEquals(repoResponse, response);
    }

    @Test
    public void testDeleteAccount() {
        String idToken = "some_token";
        String repoResponse = "Account deleted";
        try {
            when(userRepository.deleteAccount(idToken)).thenReturn(repoResponse);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        String response = userService.deleteAccount(idToken);
        assertEquals(repoResponse, response);
    }

    @Test
    public void testVerifyIdTokenSuccess() throws Exception {
        try (MockedStatic<FirebaseAuth> mocked = Mockito.mockStatic(FirebaseAuth.class)) {
            FirebaseAuth firebaseAuthMock = mock(FirebaseAuth.class);
            mocked.when(FirebaseAuth::getInstance).thenReturn(firebaseAuthMock);

            when(firebaseAuthMock.verifyIdToken("valid_token")).thenReturn(null);
            boolean result = userService.verifyIdToken("valid_token");
            assertTrue(result);
        }
    }

    @Test
    public void testVerifyIdTokenFailure() throws Exception {
        try (MockedStatic<FirebaseAuth> mocked = Mockito.mockStatic(FirebaseAuth.class)) {
            FirebaseAuth firebaseAuthMock = mock(FirebaseAuth.class);
            mocked.when(FirebaseAuth::getInstance).thenReturn(firebaseAuthMock);

            FirebaseAuthException fakeException = mock(FirebaseAuthException.class);
            when(firebaseAuthMock.verifyIdToken("invalid_token")).thenThrow(fakeException);

            boolean result = userService.verifyIdToken("invalid_token");
            assertFalse(result);
        }
    }
}
