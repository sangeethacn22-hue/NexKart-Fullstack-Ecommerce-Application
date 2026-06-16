package com.nexkart.model;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "first_name")
	private String firstName;

	@Column(name = "last_name")
	private String lastName;

	@Column(unique = true)
	private String email;

	private String password;
	private String phone;

	@Enumerated(EnumType.STRING)
	private Role role = Role.CUSTOMER;

	@Column(name = "profile_image")
	private String profileImage;

	private boolean enabled = true;

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<Address> addresses = new ArrayList<>();

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<Order> orders = new ArrayList<>();

	@OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
	private Cart cart;

	@CreatedDate
	@Column(name = "created_at", updatable = false)
	private LocalDateTime createdAt;

	@LastModifiedDate
	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	public enum Role {
		ADMIN, CUSTOMER, SELLER
	}

	// Constructors
	public User() {
	}

	// Getters
	public Long getId() {
		return id;
	}

	public String getFirstName() {
		return firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public String getEmail() {
		return email;
	}

	public String getPassword() {
		return password;
	}

	public String getPhone() {
		return phone;
	}

	public Role getRole() {
		return role;
	}

	public String getProfileImage() {
		return profileImage;
	}

	public boolean isEnabled() {
		return enabled;
	}

	public List<Address> getAddresses() {
		return addresses;
	}

	public List<Order> getOrders() {
		return orders;
	}

	public Cart getCart() {
		return cart;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	// Setters
	public void setId(Long id) {
		this.id = id;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public void setProfileImage(String profileImage) {
		this.profileImage = profileImage;
	}

	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}

	public void setAddresses(List<Address> addresses) {
		this.addresses = addresses;
	}

	public void setOrders(List<Order> orders) {
		this.orders = orders;
	}

	public void setCart(Cart cart) {
		this.cart = cart;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}
}