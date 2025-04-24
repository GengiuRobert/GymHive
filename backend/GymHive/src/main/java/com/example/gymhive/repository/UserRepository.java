package com.example.gymhive.repository;

import com.example.gymhive.entity.AuthResponse;
import com.example.gymhive.entity.User;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

@Repository
@Component
public class UserRepository {

    @Value("${firebase.api-key}")
    private String apiKey;

    public AuthResponse signUp(User user) throws IOException {
        String url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + apiKey;
        JSONObject json = postAuthRequest(user, url);
        return parseAuthResponse(json);
    }

    public AuthResponse logIn(User user) throws IOException {
        System.out.println(apiKey);
        String url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + apiKey;
        JSONObject json = postAuthRequest(user, url);
        return parseAuthResponse(json);
    }

    public String sendEmailVerification(String idToken) throws IOException {
        String url = "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=" + apiKey;
        JSONObject payload = new JSONObject()
                .put("requestType", "VERIFY_EMAIL")
                .put("idToken", idToken);
        JSONObject json = postRequest(url, payload.toString());
        return "Verification email sent to: " + json.getString("email");
    }

    public String deleteAccount(String idToken) throws IOException {
        String url = "https://identitytoolkit.googleapis.com/v1/accounts:delete?key=" + apiKey;
        JSONObject payload = new JSONObject().put("idToken", idToken);
        JSONObject json = postRequest(url, payload.toString());
        return json.has("idToken")
                ? "Account deleted successfully!"
                : "Delete failed: " + json;
    }

    private JSONObject postAuthRequest(User user, String urlStr) throws IOException {
        String payload = new JSONObject()
                .put("email", user.getEmail())
                .put("password", user.getPassword())
                .put("returnSecureToken", true)
                .toString();
        return postRequest(urlStr, payload);
    }

    private JSONObject postRequest(String urlStr, String jsonPayload) throws IOException {
        URL url = new URL(urlStr);
        HttpURLConnection conn = (HttpURLConnection)url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoOutput(true);
        try (OutputStream os = conn.getOutputStream()) {
            os.write(jsonPayload.getBytes(StandardCharsets.UTF_8));
        }
        try (InputStream is = conn.getInputStream();
             BufferedReader br = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) sb.append(line);
            return new JSONObject(sb.toString());
        }
    }

    private AuthResponse parseAuthResponse(JSONObject json) {
        return new AuthResponse(
                json.getString("idToken"),
                json.getString("email"),
                json.getString("refreshToken"),
                json.getString("expiresIn"),
                json.getString("localId")
        );
    }
}
