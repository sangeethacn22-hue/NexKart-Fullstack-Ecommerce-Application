package com.nexkart.service;

import com.nexkart.model.Address;
import com.nexkart.model.User;
import com.nexkart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Get user by email
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }

    // Update profile fields
    public User updateProfile(String email, Map<String, String> data) {
        User user = getUserByEmail(email);
        if (data.containsKey("firstName") && data.get("firstName") != null) {
            user.setFirstName(data.get("firstName"));
        }
        if (data.containsKey("lastName") && data.get("lastName") != null) {
            user.setLastName(data.get("lastName"));
        }
        if (data.containsKey("phone") && data.get("phone") != null) {
            user.setPhone(data.get("phone"));
        }
        return userRepository.save(user);
    }

    // Get all addresses of a user
    public List<Address> getAddresses(String email) {
        User user = getUserByEmail(email);
        List<Address> addresses = user.getAddresses();
        if (addresses == null) {
            return new ArrayList<>();
        }
        return addresses;
    }

    // Add new address to user
    public Address addAddress(String email, Address address) {
        User user = getUserByEmail(email);

        // Initialize addresses list if null
        if (user.getAddresses() == null) {
            user.setAddresses(new ArrayList<>());
        }

        // Set default country if not provided
        if (address.getCountry() == null || address.getCountry().isEmpty()) {
            address.setCountry("India");
        }

        // Link address to user
        address.setUser(user);

        // Add to user's address list
        user.getAddresses().add(address);

        // Save user (cascades to address)
        User saved = userRepository.save(user);

        // Return the last added address
        List<Address> savedAddresses = saved.getAddresses();
        return savedAddresses.get(savedAddresses.size() - 1);
    }

    // Update an existing address
    public Address updateAddress(Long addressId, String email, Address updated) {
        User user = getUserByEmail(email);

        Address address = user.getAddresses().stream()
                .filter(a -> a.getId().equals(addressId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Address not found: " + addressId));

        if (updated.getName() != null) address.setName(updated.getName());
        if (updated.getPhone() != null) address.setPhone(updated.getPhone());
        if (updated.getAddressLine1() != null) address.setAddressLine1(updated.getAddressLine1());
        if (updated.getAddressLine2() != null) address.setAddressLine2(updated.getAddressLine2());
        if (updated.getCity() != null) address.setCity(updated.getCity());
        if (updated.getState() != null) address.setState(updated.getState());
        if (updated.getPincode() != null) address.setPincode(updated.getPincode());
        if (updated.getCountry() != null) address.setCountry(updated.getCountry());
        address.setDefault(updated.isDefault());

        userRepository.save(user);
        return address;
    }

    // Delete an address
    public void deleteAddress(Long addressId, String email) {
        User user = getUserByEmail(email);
        boolean removed = user.getAddresses()
                .removeIf(a -> a.getId().equals(addressId));
        if (!removed) {
            throw new RuntimeException("Address not found: " + addressId);
        }
        userRepository.save(user);
    }

    // Get all users (admin)
    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }
}