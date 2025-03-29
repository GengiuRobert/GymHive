package com.example.gymhive.repository;

import com.example.gymhive.entity.User;
import org.springframework.stereotype.Repository;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

@Repository
public class UserRepository {

    private static final String API_KEY = "AIzaSyDy7yDUghA_8WYM7MszGiXaRWfA1pc_H5g";

    public String signUp(User user) throws Exception {
        String signUpURL = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + API_KEY;
        URL url = new URL(signUpURL);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoOutput(true);

        String requestPayload = String.format("{\"email\":\"%s\",\"password\":\"%s\",\"returnSecureToken\":true}",
                user.getUserEmail(), user.getPassword());

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

            if (responseBody.contains("localId")) {
                return "SignUp successful!";
            } else {

                return "SignUp failed: " + responseBody;
            }
        } catch (Exception e) {
            return "An error occurred during sign-up: " + e.getMessage();
        }
    }

    public String logIn(User user) throws Exception {
        String logInURL = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + API_KEY;
        URL url = new URL(logInURL);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoOutput(true);

        String requestPayload = String.format("{\"email\":\"%s\",\"password\":\"%s\",\"returnSecureToken\":true}",
                user.getUserEmail(), user.getPassword());

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
                return "SignIn successful!";
            } else {
                return "SignIn failed: " + responseBody;
            }
        } catch (Exception e) {
            return "An error occurred during sign-in: " + e.getMessage();
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
}
