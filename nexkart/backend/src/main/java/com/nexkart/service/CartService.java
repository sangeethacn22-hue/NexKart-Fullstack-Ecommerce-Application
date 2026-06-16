package com.nexkart.service;

import com.nexkart.model.*;
import com.nexkart.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class CartService {

	@Autowired
	private CartRepository cartRepository;
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private ProductRepository productRepository;

	public Map<String, Object> getCart(String email) {
		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
		Cart cart = cartRepository.findByUserId(user.getId()).orElse(null);

		if (cart == null || cart.getItems().isEmpty()) {
			Map<String, Object> empty = new HashMap<>();
			empty.put("items", new ArrayList<>());
			empty.put("totalItems", 0);
			empty.put("totalAmount", BigDecimal.ZERO);
			return empty;
		}

		List<Map<String, Object>> items = cart.getItems().stream().map(item -> {
			Map<String, Object> map = new HashMap<>();
			map.put("id", item.getId());
			map.put("quantity", item.getQuantity());
			map.put("productId", item.getProduct().getId());
			map.put("productName", item.getProduct().getName());
			map.put("productImage", item.getProduct().getImageUrl());
			map.put("price", item.getProduct().getPrice());
			map.put("discountPrice", item.getProduct().getDiscountPrice());
			map.put("stock", item.getProduct().getStock());
			BigDecimal effectivePrice = item.getProduct().getDiscountPrice() != null
					? item.getProduct().getDiscountPrice()
					: item.getProduct().getPrice();
			map.put("subtotal", effectivePrice.multiply(BigDecimal.valueOf(item.getQuantity())));
			return map;
		}).collect(Collectors.toList());

		BigDecimal total = items.stream().map(i -> (BigDecimal) i.get("subtotal")).reduce(BigDecimal.ZERO,
				BigDecimal::add);

		Map<String, Object> result = new HashMap<>();
		result.put("items", items);
		result.put("totalItems", items.size());
		result.put("totalAmount", total);
		return result;
	}

	public Map<String, Object> addToCart(String email, Long productId, Integer quantity) {
		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new RuntimeException("Product not found"));

		if (product.getStock() < quantity) {
			throw new RuntimeException("Insufficient stock");
		}

		Cart cart = cartRepository.findByUserId(user.getId()).orElse(null);
		if (cart == null) {
			cart = new Cart();
			cart.setUser(user);
			cart.setItems(new ArrayList<>());
			cart = cartRepository.save(cart);
		}

		Optional<CartItem> existing = cart.getItems().stream().filter(i -> i.getProduct().getId().equals(productId))
				.findFirst();

		if (existing.isPresent()) {
			existing.get().setQuantity(existing.get().getQuantity() + quantity);
		} else {
			CartItem item = new CartItem();
			item.setCart(cart);
			item.setProduct(product);
			item.setQuantity(quantity);
			cart.getItems().add(item);
		}

		cartRepository.save(cart);
		return getCart(email);
	}

	public Map<String, Object> updateCartItem(String email, Long cartItemId, Integer quantity) {
		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
		Cart cart = cartRepository.findByUserId(user.getId()).orElseThrow(() -> new RuntimeException("Cart not found"));

		cart.getItems().stream().filter(i -> i.getId().equals(cartItemId)).findFirst().ifPresent(item -> {
			if (quantity <= 0)
				cart.getItems().remove(item);
			else
				item.setQuantity(quantity);
		});

		cartRepository.save(cart);
		return getCart(email);
	}

	public void removeFromCart(String email, Long cartItemId) {
		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
		Cart cart = cartRepository.findByUserId(user.getId()).orElseThrow(() -> new RuntimeException("Cart not found"));
		cart.getItems().removeIf(i -> i.getId().equals(cartItemId));
		cartRepository.save(cart);
	}

	public void clearCart(String email) {
		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
		cartRepository.findByUserId(user.getId()).ifPresent(cart -> {
			cart.getItems().clear();
			cartRepository.save(cart);
		});
	}
}