package com.nexkart.model;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@EntityListeners(AuditingEntityListener.class)
public class Product {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String name;

	@Column(columnDefinition = "TEXT")
	private String description;

	private BigDecimal price;

	@Column(name = "discount_price")
	private BigDecimal discountPrice;

	private Integer stock;

	@Column(name = "image_url")
	private String imageUrl;

	@ElementCollection
	@CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
	@Column(name = "image_url")
	private List<String> images = new ArrayList<>();

	private String brand;
	private Double rating;

	@Column(name = "review_count")
	private Integer reviewCount = 0;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "category_id")
	private Category category;

	@Enumerated(EnumType.STRING)
	private ProductStatus status = ProductStatus.ACTIVE;

	private Boolean featured;

	@OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
	private List<Review> reviews = new ArrayList<>();

	@CreatedDate
	@Column(name = "created_at", updatable = false)
	private LocalDateTime createdAt;

	@LastModifiedDate
	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	public enum ProductStatus {
		ACTIVE, INACTIVE, OUT_OF_STOCK
	}

	public Product() {
	}

	// Getters
	public Long getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public String getDescription() {
		return description;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public BigDecimal getDiscountPrice() {
		return discountPrice;
	}

	public Integer getStock() {
		return stock;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public List<String> getImages() {
		return images;
	}

	public String getBrand() {
		return brand;
	}

	public Double getRating() {
		return rating;
	}

	public Integer getReviewCount() {
		return reviewCount;
	}

	public Category getCategory() {
		return category;
	}

	public ProductStatus getStatus() {
		return status;
	}

	public Boolean getFeatured() {
		return featured;
	}

	public List<Review> getReviews() {
		return reviews;
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

	public void setName(String name) {
		this.name = name;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public void setDiscountPrice(BigDecimal discountPrice) {
		this.discountPrice = discountPrice;
	}

	public void setStock(Integer stock) {
		this.stock = stock;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public void setImages(List<String> images) {
		this.images = images;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public void setRating(Double rating) {
		this.rating = rating;
	}

	public void setReviewCount(Integer reviewCount) {
		this.reviewCount = reviewCount;
	}

	public void setCategory(Category category) {
		this.category = category;
	}

	public void setStatus(ProductStatus status) {
		this.status = status;
	}

	public void setFeatured(Boolean featured) {
		this.featured = featured;
	}

	public void setReviews(List<Review> reviews) {
		this.reviews = reviews;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}
}