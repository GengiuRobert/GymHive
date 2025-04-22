package com.example.gymhive.service;

import com.example.gymhive.entity.Address;
import com.example.gymhive.entity.Category;
import com.example.gymhive.entity.OrderEmailRequest;
import com.example.gymhive.repository.OrderRepository;
import com.google.api.client.util.Value;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    private final OrderRepository orderRepository;
    private final JavaMailSender mailSender;
    private final com.samskivert.mustache.Mustache.Compiler mustache;

    public EmailService(OrderRepository orderRepository, JavaMailSender mailSender, com.samskivert.mustache.Mustache.Compiler mustache) {
        this.orderRepository = orderRepository;
        this.mailSender = mailSender;
        this.mustache = mustache;
    }

    public String addOrderEmail(OrderEmailRequest orderEmailRequest) {
        return orderRepository.save(orderEmailRequest);
    }

    public void sendOrderConfirmation(OrderEmailRequest req) throws MessagingException, UnsupportedEncodingException {
        Map<String,Object> model = new HashMap<>();
        model.put("customer_name",   req.getCustomerName());
        model.put("customer_email",  req.getCustomerEmail());
        model.put("order_number",    req.getOrderID());
        model.put("order_date",      req.getOrderDate().toString());

        List<Map<String,Object>> products = req.getItems().stream().map(item -> {
            Map<String,Object> m = new HashMap<>();
            m.put("name",      item.getProduct().getName());
            m.put("sku",       item.getProduct().getProductId());
            m.put("image_url", item.getProduct().getImageUrl());
            m.put("quantity",  item.getQuantity());
            m.put("price",     String.format("%.2f", item.getProduct().getPrice()));
            m.put("total",     String.format("%.2f", item.getProduct().getPrice() * item.getQuantity()));
            return m;
        }).toList();
        model.put("products", products);

        double subtotal = products.stream()
                .mapToDouble(p -> Double.parseDouble((String)p.get("total")))
                .sum();
        model.put("subtotal",      String.format("%.2f", subtotal));
        model.put("shipping_cost", String.format("%.2f", req.getShippingCost()));
        model.put("tax",           String.format("%.2f", req.getTax()));
        model.put("total",         String.format("%.2f", subtotal
                + req.getShippingCost()
                + req.getTax()));

        Address a = req.getAddress();
        model.put("shipping_name",    req.getCustomerName());
        model.put("shipping_address", a.getStreet());
        model.put("shipping_city",    a.getCity());
        model.put("shipping_state",   a.getState());
        model.put("shipping_zip",     a.getZipCode());
        model.put("shipping_country", a.getCountry());
        model.put("shipping_phone",   req.getPhone());

        String html;

        try {
            String templateContent = loadTemplate("order-confirmation.html");
            html = mustache.compile(templateContent).execute(model);
        } catch (IOException e) {
            throw new MessagingException("Failed to load email template", e);
        }

        MimeMessage msg = mailSender.createMimeMessage();
        MimeMessageHelper h = new MimeMessageHelper(msg, true, "UTF-8");
        h.setFrom("no-reply@gymhive.com");
        h.setTo(req.getCustomerEmail());
        h.setSubject("Your Order Confirmation");
        h.setText(html, true);
        mailSender.send(msg);
    }

    private String loadTemplate(String templateName) throws IOException {
        ClassPathResource resource = new ClassPathResource("templates/" + templateName);
        try (Reader reader = new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8)) {
            return FileCopyUtils.copyToString(reader);
        }
    }
}
