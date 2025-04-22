package com.example.gymhive.controller;

import com.example.gymhive.dto.OrderEmailRequestDto;
import com.example.gymhive.entity.Address;
import com.example.gymhive.entity.CartItem;
import com.example.gymhive.entity.OrderEmailRequest;
import com.example.gymhive.repository.OrderRepository;
import org.modelmapper.TypeToken;
import com.example.gymhive.service.EmailService;
import jakarta.mail.MessagingException;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.Type;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class EmailController {

    private final EmailService emailService;
    private final ModelMapper modelMapper;

    public EmailController(EmailService emailService, ModelMapper modelMapper) {
        this.emailService = emailService;
        this.modelMapper = modelMapper;
    }

    @PostMapping("/email")
    public ResponseEntity<Void> emailCart(@Valid @RequestBody OrderEmailRequestDto dto) {
        OrderEmailRequest req = toEntity(dto);
        try {
            emailService.sendOrderConfirmation(req);
            return ResponseEntity.ok().build();
        } catch (MessagingException | UnsupportedEncodingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/email/add-order")
    public ResponseEntity<String> addOrder(@Valid @RequestBody OrderEmailRequestDto dto) {
        OrderEmailRequest req = toEntity(dto);
        String result = emailService.addOrderEmail(req);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/email/get-orders-by-user-id/{userId}")
    public ResponseEntity<List<OrderEmailRequestDto>> getOrdersByUserId(
            @PathVariable String userId) {

        List<OrderEmailRequest> entities = emailService.getOrdersByUserId(userId);

        List<OrderEmailRequestDto> dtos = entities.stream()
                .map(e -> modelMapper.map(e, OrderEmailRequestDto.class))
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    private OrderEmailRequest toEntity(OrderEmailRequestDto dto) {
        Type listType = new TypeToken<List<CartItem>>() {}.getType();
        List<CartItem> items = modelMapper.map(dto.getItems(), listType);

        Address address = modelMapper.map(dto.getAddress(), Address.class);

        OrderEmailRequest req = modelMapper.map(dto, OrderEmailRequest.class);

        req.setItems(items);
        req.setAddress(address);

        return req;
    }

}
