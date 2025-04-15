package com.example.gymhive.repository;

import com.example.gymhive.entity.AuthResponse;
import com.example.gymhive.entity.User;
import org.json.JSONObject;
import org.springframework.stereotype.Repository;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

@Repository
public class UserRepository {

    private static final String API_KEY = "AIzaSyDy7yDUghA_8WYM7MszGiXaRWfA1pc_H5g";

    public AuthResponse signUp(User user) throws Exception {
        String signUpURL = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + API_KEY;
        HttpURLConnection conn = authActionRequest(user, signUpURL);

        try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
            StringBuilder response = new StringBuilder();
            String responseLine;
            while ((responseLine = br.readLine()) != null) {
                response.append(responseLine.trim());
            }

            String responseBody = response.toString();

            JSONObject jsonResponse = new JSONObject(responseBody);

            if (jsonResponse.has("idToken")) {
                return getAuthResponse(jsonResponse);
            } else {
                if (jsonResponse.has("error")) {
                    JSONObject error = jsonResponse.getJSONObject("error");
                    String errorMessage = error.getString("message");
                    throw new Exception("SignUp failed: " + errorMessage);
                } else {
                    throw new Exception("Unknown error occurred during sign-up.");
                }
            }
        } catch (Exception e) {
            throw new Exception("[REPOSITORY] An error occurred during sign-up: " + e.getMessage() +"\n\n");
        }
    }

    public AuthResponse logIn(User user) throws Exception {
        String logInURL = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + API_KEY;
        authActionRequest(user, logInURL);
        HttpURLConnection conn = authActionRequest(user, logInURL);

        try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
            StringBuilder response = new StringBuilder();
            String responseLine;
            while ((responseLine = br.readLine()) != null) {
                response.append(responseLine.trim());
            }

            String responseBody = response.toString();
            JSONObject jsonResponse = new JSONObject(responseBody);

            if (jsonResponse.has("idToken")) {
                return getAuthResponse(jsonResponse);
            } else {
                if (jsonResponse.has("error")) {
                    JSONObject error = jsonResponse.getJSONObject("error");
                    String errorMessage = error.getString("message");
                    throw new Exception("LogIn failed: " + errorMessage);
                } else {
                    throw new Exception("Unknown error occurred during log-in.");
                }
            }
        } catch (Exception e) {
            throw new Exception("[REPOSITORY] An error occurred during log-in: " + e.getMessage() +"\n\n");
        }
    }

    public String sendEmailVerification(String idToken) throws Exception {
        String verificationURL = "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=" + API_KEY;
        URL url = new URL(verificationURL);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoOutput(true);

        String requestPayload = String.format("{\"requestType\":\"VERIFY_EMAIL\",\"idToken\":\"%s\"}", idToken);

        try (OutputStream os = conn.getOutputStream()) {
            byte[] input = requestPayload.getBytes(StandardCharsets.UTF_8);
            os.write(input, 0, input.length);
        }

        try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
            StringBuilder response = new StringBuilder();
            String responseLine;
            while ((responseLine = br.readLine()) != null) {
                response.append(responseLine.trim());
            }
            String responseBody = response.toString();
            JSONObject jsonResponse = new JSONObject(responseBody);

            if (jsonResponse.has("email")) {
                return "Verification email sent to: " + jsonResponse.getString("email");
            } else {
                throw new Exception("Email verification failed: " + responseBody);
            }
        } catch (Exception e) {
            throw new Exception("[REPOSITORY] An error occurred during email verification: " + e.getMessage());
        }
    }

    public String deleteAccount(String userId) throws Exception {
        String deleteAccountURL = "https://identitytoolkit.googleapis.com/v1/accounts:delete?key=" + API_KEY;
        URL url = new URL(deleteAccountURL);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoOutput(true);

        String requestPayload = String.format("{\"idToken\":\"%s\"}", userId);

        try (OutputStream os = conn.getOutputStream()) {
            byte[] input = requestPayload.getBytes(StandardCharsets.UTF_8);
            os.write(input, 0, input.length);
        }

        try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
            StringBuilder response = new StringBuilder();
            String responseLine;
            while ((responseLine = br.readLine()) != null) {
                response.append(responseLine.trim());
            }

            String responseBody = response.toString();

            if (responseBody.contains("idToken")) {
                return "Account deleted successfully!";
            } else {
                return "Delete failed: " + responseBody;
            }
        } catch (Exception e) {
            return "An error occurred during account deletion: " + e.getMessage();
        }
    }

    private AuthResponse getAuthResponse(JSONObject jsonResponse) {
        String idToken = jsonResponse.getString("idToken");
        String email = jsonResponse.getString("email");
        String refreshToken = jsonResponse.getString("refreshToken");
        String expiresIn = jsonResponse.getString("expiresIn");
        String localId = jsonResponse.getString("localId");

        return new AuthResponse(idToken, email, refreshToken, expiresIn, localId);
    }

    private HttpURLConnection authActionRequest(User user, String authURL) throws IOException {
        URL url = new URL(authURL);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoOutput(true);

        String requestPayload = String.format("{\"email\":\"%s\",\"password\":\"%s\",\"returnSecureToken\":true}",
                user.getEmail(), user.getPassword());

        try (OutputStream os = conn.getOutputStream()) {
            byte[] input = requestPayload.getBytes(StandardCharsets.UTF_8);
            os.write(input, 0, input.length);
        }
        
        return conn;
    }
}
