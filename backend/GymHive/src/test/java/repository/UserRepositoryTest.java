package repository;

import com.example.gymhive.repository.UserRepository;
import com.example.gymhive.entity.AuthResponse;
import com.example.gymhive.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.junit.jupiter.api.Test;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLStreamHandler;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class UserRepositoryTest {

    @Mock
    private HttpURLConnection connection;

    @InjectMocks
    private UserRepository userRepository;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSignUpSuccess() throws Exception {
        URL.setURLStreamHandlerFactory(protocol -> {
            if ("https".equals(protocol)) {
                return new URLStreamHandler() {
                    @Override
                    protected URLConnection openConnection(URL u) throws IOException {
                        return connection;
                    }
                };
            }
            return null;
        });

        User user = new User("testUser", "test@example.com", "password123");

        when(connection.getOutputStream()).thenReturn(mock(OutputStream.class));

        String successResponse = "{\"idToken\":\"some_token\",\"email\":\"test@example.com\",\"refreshToken\":\"some_refresh_token\",\"expiresIn\":\"3600\",\"localId\":\"12345\"}";
        InputStream successInputStream = new ByteArrayInputStream(successResponse.getBytes());
        when(connection.getInputStream()).thenReturn(successInputStream);
        when(connection.getResponseCode()).thenReturn(HttpURLConnection.HTTP_OK);

        AuthResponse response = userRepository.signUp(user);
        System.out.println(response);

        assertNotNull(response);
        assertEquals("some_token", response.getIdToken());
        assertEquals("test@example.com", response.getEmail());
        assertEquals("some_refresh_token", response.getRefreshToken());
        assertEquals("3600", response.getExpiresIn());
        assertEquals("12345", response.getLocalId());
    }

    @Test
    void testSignUpFailure() throws Exception {
        URL.setURLStreamHandlerFactory(protocol -> {
            if ("https".equals(protocol)) {
                return new URLStreamHandler() {
                    @Override
                    protected URLConnection openConnection(URL u) throws IOException {
                        return connection;
                    }
                };
            }
            return null;
        });

        User user = new User("testUser", "test@example.com", "password123");

        when(connection.getOutputStream()).thenReturn(mock(OutputStream.class));

        String errorResponse = "{\"error\":\"EMAIL_EXISTS\"}";
        InputStream errorInputStream = new ByteArrayInputStream(errorResponse.getBytes());
        when(connection.getInputStream()).thenReturn(errorInputStream);

        Exception exception = null;
        try {
            userRepository.signUp(user);
        } catch (Exception e) {
            exception = e;
        }

        assertNotNull(exception);
        assertEquals("Email address is already in use.", exception.getMessage());
    }
}
