package com.nexkart.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;

public class ProductDto {
	@Data
	public static class Request {
		private String name;
		private String description;
		private BigDecimal price;
		private BigDecimal discountPrice;
		private Integer stock;
		private String imageUrl;
		private List<String> images;
		private String brand;
		private Long categoryId;
		private Boolean featured;

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

		public Long getCategoryId() {
			return categoryId;
		}

		public Boolean getFeatured() {
			return featured;
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

		public void setCategoryId(Long categoryId) {
			this.categoryId = categoryId;
		}

		public void setFeatured(Boolean featured) {
			this.featured = featured;
		}
	}

	@Data
	public static class Response {
		private Long id;
		private String name;
		private String description;
		private BigDecimal price;
		private BigDecimal discountPrice;
		private Integer stock;
		private String imageUrl;
		private List<String> images;
		private String brand;
		private Double rating;
		private Integer reviewCount;
		private String categoryName;
		private Long categoryId;
		private String status;
		private Boolean featured;

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

		public String getCategoryName() {
			return categoryName;
		}

		public Long getCategoryId() {
			return categoryId;
		}

		public String getStatus() {
			return status;
		}

		public Boolean getFeatured() {
			return featured;
		}

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

		public void setCategoryName(String categoryName) {
			this.categoryName = categoryName;
		}

		public void setCategoryId(Long categoryId) {
			this.categoryId = categoryId;
		}

		public void setStatus(String status) {
			this.status = status;
		}

		public void setFeatured(Boolean featured) {
			this.featured = featured;
		}
	}
}