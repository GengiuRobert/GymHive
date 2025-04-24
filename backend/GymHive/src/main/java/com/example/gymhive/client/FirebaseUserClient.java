package com.example.gymhive.client;

import com.example.gymhive.entity.AuthResponse;
import com.example.gymhive.entity.User;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

@Component
public class FirebaseUserClient {

    @Value("${firebase.api-key}")
    private String apiKey;

    public AuthResponse signUp(User user) throws IOException {
        String url = authUrl("signUp");
        JSONObject json = postAuthRequest(user, url);
        return parseAuthResponse(json);
    }

    public AuthResponse logIn(User user) throws IOException {
        String url = authUrl("signInWithPassword");
        JSONObject json = postAuthRequest(user, url);
        return parseAuthResponse(json);
    }

    public String sendEmailVerification(String idToken) throws IOException {
        String url = authUrl("sendOobCode");
        JSONObject payload = new JSONObject()
                .put("requestType", "VERIFY_EMAIL")
                .put("idToken", idToken);
        JSONObject json = postRequest(url, payload.toString());
        return "Verification email sent to: " + json.getString("email");
    }

    public String deleteAccount(String idToken) throws IOException {
        String url = authUrl("delete");
        JSONObject payload = new JSONObject().put("idToken", idToken);
        JSONObject json = postRequest(url, payload.toString());
        return json.has("idToken")
                ? "Account deleted successfully!"
                : "Delete failed: " + json.toString();
    }

    private String authUrl(String action) {
        return "https://identitytoolkit.googleapis.com/v1/accounts:"
                + action
                + "?key="
                + apiKey;
    }

    private JSONObject postAuthRequest(User user, String urlStr) throws IOException {
        JSONObject body = new JSONObject()
                .put("email", user.getEmail())
                .put("password", user.getPassword())
                .put("returnSecureToken", true);
        return postRequest(urlStr, body.toString());
    }

    private JSONObject postRequest(String urlStr, String jsonPayload) throws IOException {
        URL url = new URL(urlStr);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoOutput(true);

        try (OutputStream os = conn.getOutputStream()) {
            os.write(jsonPayload.getBytes(StandardCharsets.UTF_8));
        }

        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))
        ) {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) {
                sb.append(line);
            }
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
