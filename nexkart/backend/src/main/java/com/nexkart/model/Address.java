package com.nexkart.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "addresses")
public class Address {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id")
	@JsonIgnore // Prevents infinite loop when serializing to JSON
	private User user;

	private String name;
	private String phone;

	@Column(name = "address_line1")
	private String addressLine1;

	@Column(name = "address_line2")
	private String addressLine2;

	private String city;
	private String state;
	private String pincode;
	private String country;

	@Column(name = "is_default")
	private boolean isDefault;

	@Enumerated(EnumType.STRING)
	private AddressType type;

	public enum AddressType {
		HOME, WORK, OTHER
	}

	public Address() {
	}

	// Getters
	public Long getId() {
		return id;
	}

	public User getUser() {
		return user;
	}

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

	public boolean isDefault() {
		return isDefault;
	}

	public AddressType getType() {
		return type;
	}

	// Setters
	public void setId(Long id) {
		this.id = id;
	}

	public void setUser(User user) {
		this.user = user;
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

	public void setDefault(boolean isDefault) {
		this.isDefault = isDefault;
	}

	public void setType(AddressType type) {
		this.type = type;
	}
}