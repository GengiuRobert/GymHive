package repository;

import com.example.gymhive.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.junit.jupiter.api.Test;
import com.example.gymhive.entity.User;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLStreamHandler;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
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

        String successResponse = "{\"idToken\":\"some_token\",\"email\":\"test@example.com\"}";
        InputStream successInputStream = new ByteArrayInputStream(successResponse.getBytes());
        when(connection.getInputStream()).thenReturn(successInputStream);
        when(connection.getResponseCode()).thenReturn(HttpURLConnection.HTTP_OK);

        String response = userRepository.signUp(user);
        System.out.println(response);

        assertTrue(response.startsWith("SignUp successful!"));
        assertTrue(response.contains("ID Token: some_token"));
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

        String response = userRepository.signUp(user);
        System.out.println(response);

        assertTrue(response.startsWith("SignUp failed:"));
    }
}
