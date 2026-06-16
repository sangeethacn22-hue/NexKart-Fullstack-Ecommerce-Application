package com.nexkart.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderDto {

	public static class PlaceOrderRequest {
		private Long addressId;
		private String paymentMethod;
		private String couponCode;
		private String notes;

		public Long getAddressId() {
			return addressId;
		}

		public String getPaymentMethod() {
			return paymentMethod;
		}

		public String getCouponCode() {
			return couponCode;
		}

		public String getNotes() {
			return notes;
		}

		public void setAddressId(Long addressId) {
			this.addressId = addressId;
		}

		public void setPaymentMethod(String paymentMethod) {
			this.paymentMethod = paymentMethod;
		}

		public void setCouponCode(String couponCode) {
			this.couponCode = couponCode;
		}

		public void setNotes(String notes) {
			this.notes = notes;
		}
	}

	public static class OrderItemResponse {
		private Long productId;
		private String productName;
		private String productImage;
		private Integer quantity;
		private BigDecimal unitPrice;
		private BigDecimal totalPrice;

		public Long getProductId() {
			return productId;
		}

		public String getProductName() {
			return productName;
		}

		public String getProductImage() {
			return productImage;
		}

		public Integer getQuantity() {
			return quantity;
		}

		public BigDecimal getUnitPrice() {
			return unitPrice;
		}

		public BigDecimal getTotalPrice() {
			return totalPrice;
		}

		public void setProductId(Long productId) {
			this.productId = productId;
		}

		public void setProductName(String productName) {
			this.productName = productName;
		}

		public void setProductImage(String productImage) {
			this.productImage = productImage;
		}

		public void setQuantity(Integer quantity) {
			this.quantity = quantity;
		}

		public void setUnitPrice(BigDecimal unitPrice) {
			this.unitPrice = unitPrice;
		}

		public void setTotalPrice(BigDecimal totalPrice) {
			this.totalPrice = totalPrice;
		}
	}

	public static class OrderResponse {
		private Long id;
		private String orderNumber;
		private List<OrderItemResponse> items;
		private BigDecimal totalAmount;
		private BigDecimal discountAmount;
		private BigDecimal shippingAmount;
		private BigDecimal finalAmount;
		private String status;
		private String paymentStatus;
		private String paymentMethod;
		private AddressDto shippingAddress;
		private String trackingNumber;
		private LocalDateTime createdAt;
		private LocalDateTime deliveredAt;

		public Long getId() {
			return id;
		}

		public String getOrderNumber() {
			return orderNumber;
		}

		public List<OrderItemResponse> getItems() {
			return items;
		}

		public BigDecimal getTotalAmount() {
			return totalAmount;
		}

		public BigDecimal getDiscountAmount() {
			return discountAmount;
		}

		public BigDecimal getShippingAmount() {
			return shippingAmount;
		}

		public BigDecimal getFinalAmount() {
			return finalAmount;
		}

		public String getStatus() {
			return status;
		}

		public String getPaymentStatus() {
			return paymentStatus;
		}

		public String getPaymentMethod() {
			return paymentMethod;
		}

		public AddressDto getShippingAddress() {
			return shippingAddress;
		}

		public String getTrackingNumber() {
			return trackingNumber;
		}

		public LocalDateTime getCreatedAt() {
			return createdAt;
		}

		public LocalDateTime getDeliveredAt() {
			return deliveredAt;
		}

		public void setId(Long id) {
			this.id = id;
		}

		public void setOrderNumber(String orderNumber) {
			this.orderNumber = orderNumber;
		}

		public void setItems(List<OrderItemResponse> items) {
			this.items = items;
		}

		public void setTotalAmount(BigDecimal totalAmount) {
			this.totalAmount = totalAmount;
		}

		public void setDiscountAmount(BigDecimal discountAmount) {
			this.discountAmount = discountAmount;
		}

		public void setShippingAmount(BigDecimal shippingAmount) {
			this.shippingAmount = shippingAmount;
		}

		public void setFinalAmount(BigDecimal finalAmount) {
			this.finalAmount = finalAmount;
		}

		public void setStatus(String status) {
			this.status = status;
		}

		public void setPaymentStatus(String paymentStatus) {
			this.paymentStatus = paymentStatus;
		}

		public void setPaymentMethod(String paymentMethod) {
			this.paymentMethod = paymentMethod;
		}

		public void setShippingAddress(AddressDto shippingAddress) {
			this.shippingAddress = shippingAddress;
		}

		public void setTrackingNumber(String trackingNumber) {
			this.trackingNumber = trackingNumber;
		}

		public void setCreatedAt(LocalDateTime createdAt) {
			this.createdAt = createdAt;
		}

		public void setDeliveredAt(LocalDateTime deliveredAt) {
			this.deliveredAt = deliveredAt;
		}
	}

	public static class AddressDto {
		private String name;
		private String phone;
		private String addressLine1;
		private String addressLine2;
		private String city;
		private String state;
		private String pincode;
		private String country;

		public String getName() {
			return name;
		}

		public String getPhone() {
			return phone;
		}

		public String getAddressLine1() {
			return addressLine1;
		}

		public String getAddressLine2() {
			return addressLine2;
		}

		public String getCity() {
			return city;
		}

		public String getState() {
			return state;
		}

		public String getPincode() {
			return pincode;
		}

		public String getCountry() {
			return country;
		}

		public void setName(String name) {
			this.name = name;
		}

		public void setPhone(String phone) {
			this.phone = phone;
		}

		public void setAddressLine1(String addressLine1) {
			this.addressLine1 = addressLine1;
		}

		public void setAddressLine2(String addressLine2) {
			this.addressLine2 = addressLine2;
		}

		public void setCity(String city) {
			this.city = city;
		}

		public void setState(String state) {
			this.state = state;
		}

		public void setPincode(String pincode) {
			this.pincode = pincode;
		}

		public void setCountry(String country) {
			this.country = country;
		}
	}
}