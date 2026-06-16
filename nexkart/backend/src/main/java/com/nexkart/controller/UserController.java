package com.nexkart.controller;

import com.nexkart.model.Address;
import com.nexkart.model.User;
import com.nexkart.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    // Get current user profile
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        try {
            User user = userService.getUserByEmail(authentication.getName());
            Map<String, Object> result = new HashMap<>();
            result.put("id", user.getId());
            result.put("firstName", user.getFirstName());
            result.put("lastName", user.getLastName());
            result.put("email", user.getEmail());
            result.put("phone", user.getPhone() != null ? user.getPhone() : "");
            result.put("role", user.getRole().name());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        }
    }

    // Update profile
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        try {
            User user = userService.updateProfile(authentication.getName(), request);
            Map<String, Object> result = new HashMap<>();
            result.put("id", user.getId());
            result.put("firstName", user.getFirstName());
            result.put("lastName", user.getLastName());
            result.put("email", user.getEmail());
            result.put("phone", user.getPhone() != null ? user.getPhone() : "");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        }
    }

    // Get all addresses of current user
    @GetMapping("/addresses")
    public ResponseEntity<?> getAddresses(Authentication authentication) {
        try {
            List<Address> addresses = userService.getAddresses(authentication.getName());
            return ResponseEntity.ok(addresses);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        }
    }

    // Add new address
    @PostMapping("/addresses")
    public ResponseEntity<?> addAddress(
            @RequestBody Address address,
            Authentication authentication) {
        try {
            Address saved = userService.addAddress(authentication.getName(), address);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        }
    }

    // Update existing address
    @PutMapping("/addresses/{id}")
    public ResponseEntity<?> updateAddress(
            @PathVariable Long id,
            @RequestBody Address address,
            Authentication authentication) {
        try {
            Address updated = userService.updateAddress(
                id, authentication.getName(), address);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        }
    }

    // Delete address
    @DeleteMapping("/addresses/{id}")
    public ResponseEntity<?> deleteAddress(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            userService.deleteAddress(id, authentication.getName());
            return ResponseEntity.ok(Map.of("message", "Address deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        }
    }

    // Admin - Get all users
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<User>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(
            userService.getAllUsers(PageRequest.of(page, size)));
    }
}