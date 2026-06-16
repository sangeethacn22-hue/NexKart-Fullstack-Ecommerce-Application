package com.nexkart.service;

import com.nexkart.dto.OrderDto;
import com.nexkart.model.*;
import com.nexkart.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {

	@Autowired
	private OrderRepository orderRepository;
	@Autowired
	private CartRepository cartRepository;
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private ProductRepository productRepository;

	public OrderDto.OrderResponse placeOrder(String email, OrderDto.PlaceOrderRequest request) {
		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		Cart cart = cartRepository.findByUserId(user.getId()).orElseThrow(() -> new RuntimeException("Cart is empty"));

		if (cart.getItems().isEmpty()) {
			throw new RuntimeException("Cart is empty");
		}

		Address shippingAddress = user.getAddresses().stream().filter(a -> a.getId().equals(request.getAddressId()))
				.findFirst().orElseThrow(() -> new RuntimeException("Address not found"));

		String orderNumber = "NXK" + System.currentTimeMillis();
		BigDecimal totalAmount = BigDecimal.ZERO;

		Order order = new Order();
		order.setOrderNumber(orderNumber);
		order.setUser(user);
		order.setPaymentMethod(request.getPaymentMethod());
		order.setShippingAddress(shippingAddress);
		order.setShippingAmount(new BigDecimal("49.00"));
		order.setNotes(request.getNotes());
		order.setStatus(Order.OrderStatus.PENDING);
		order.setPaymentStatus(Order.PaymentStatus.PENDING);

		List<OrderItem> orderItems = new ArrayList<>();

		for (CartItem cartItem : cart.getItems()) {
			Product product = cartItem.getProduct();

			if (product.getStock() < cartItem.getQuantity()) {
				throw new RuntimeException("Insufficient stock for: " + product.getName());
			}

			BigDecimal unitPrice = product.getDiscountPrice() != null ? product.getDiscountPrice() : product.getPrice();
			BigDecimal itemTotal = unitPrice.multiply(BigDecimal.valueOf(cartItem.getQuantity()));
			totalAmount = totalAmount.add(itemTotal);

			OrderItem item = new OrderItem();
			item.setOrder(order);
			item.setProduct(product);
			item.setQuantity(cartItem.getQuantity());
			item.setUnitPrice(unitPrice);
			item.setTotalPrice(itemTotal);
			orderItems.add(item);

			product.setStock(product.getStock() - cartItem.getQuantity());
			productRepository.save(product);
		}

		order.setItems(orderItems);
		order.setTotalAmount(totalAmount);
		order.setDiscountAmount(BigDecimal.ZERO);
		order.setFinalAmount(totalAmount.add(order.getShippingAmount()));

		Order saved = orderRepository.save(order);

		cart.getItems().clear();
		cartRepository.save(cart);

		return toResponse(saved);
	}

	public Page<OrderDto.OrderResponse> getUserOrders(String email, Pageable pageable) {
		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
		return orderRepository.findByUserId(user.getId(), pageable).map(this::toResponse);
	}

	public OrderDto.OrderResponse getOrderById(Long id, String email) {
		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
		Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));

		if (!order.getUser().getId().equals(user.getId()) && !user.getRole().equals(User.Role.ADMIN)) {
			throw new RuntimeException("Unauthorized");
		}
		return toResponse(order);
	}

	public void cancelOrder(Long id, String email) {
		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
		Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));

		if (!order.getUser().getId().equals(user.getId())) {
			throw new RuntimeException("Unauthorized");
		}
		if (order.getStatus() == Order.OrderStatus.SHIPPED || order.getStatus() == Order.OrderStatus.DELIVERED) {
			throw new RuntimeException("Cannot cancel order in current status");
		}
		order.setStatus(Order.OrderStatus.CANCELLED);
		orderRepository.save(order);
	}

	public Page<OrderDto.OrderResponse> getAllOrders(Pageable pageable) {
		return orderRepository.findAll(pageable).map(this::toResponse);
	}

	public OrderDto.OrderResponse updateOrderStatus(Long id, String status) {
		Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
		order.setStatus(Order.OrderStatus.valueOf(status));
		if (status.equals("DELIVERED")) {
			order.setDeliveredAt(LocalDateTime.now());
		}
		return toResponse(orderRepository.save(order));
	}

	private OrderDto.OrderResponse toResponse(Order order) {
		OrderDto.OrderResponse resp = new OrderDto.OrderResponse();
		resp.setId(order.getId());
		resp.setOrderNumber(order.getOrderNumber());
		resp.setTotalAmount(order.getTotalAmount());
		resp.setDiscountAmount(order.getDiscountAmount());
		resp.setShippingAmount(order.getShippingAmount());
		resp.setFinalAmount(order.getFinalAmount());
		resp.setStatus(order.getStatus().name());
		resp.setPaymentStatus(order.getPaymentStatus().name());
		resp.setPaymentMethod(order.getPaymentMethod());
		resp.setTrackingNumber(order.getTrackingNumber());
		resp.setCreatedAt(order.getCreatedAt());
		resp.setDeliveredAt(order.getDeliveredAt());

		List<OrderDto.OrderItemResponse> items = order.getItems().stream().map(i -> {
			OrderDto.OrderItemResponse ir = new OrderDto.OrderItemResponse();
			ir.setProductId(i.getProduct().getId());
			ir.setProductName(i.getProduct().getName());
			ir.setProductImage(i.getProduct().getImageUrl());
			ir.setQuantity(i.getQuantity());
			ir.setUnitPrice(i.getUnitPrice());
			ir.setTotalPrice(i.getTotalPrice());
			return ir;
		}).collect(Collectors.toList());
		resp.setItems(items);

		if (order.getShippingAddress() != null) {
			Address addr = order.getShippingAddress();
			OrderDto.AddressDto addrDto = new OrderDto.AddressDto();
			addrDto.setName(addr.getName());
			addrDto.setPhone(addr.getPhone());
			addrDto.setAddressLine1(addr.getAddressLine1());
			addrDto.setAddressLine2(addr.getAddressLine2());
			addrDto.setCity(addr.getCity());
			addrDto.setState(addr.getState());
			addrDto.setPincode(addr.getPincode());
			addrDto.setCountry(addr.getCountry());
			resp.setShippingAddress(addrDto);
		}
		return resp;
	}
}