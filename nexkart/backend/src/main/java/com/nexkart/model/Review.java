package com.nexkart.model;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@EntityListeners(AuditingEntityListener.class)
public class Review {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "product_id")
	private Product product;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id")
	private User user;

	private Integer rating;
	private String title;

	@Column(columnDefinition = "TEXT")
	private String comment;

	@CreatedDate
	@Column(name = "created_at", updatable = false)
	private LocalDateTime createdAt;

	public Review() {
	}

	public Long getId() {
		return id;
	}

	public Product getProduct() {
		return product;
	}

	public User getUser() {
		return user;
	}

	public Integer getRating() {
		return rating;
	}

	public String getTitle() {
		return title;
	}

	public String getComment() {
		return comment;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public void setProduct(Product product) {
		this.product = product;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public void setRating(Integer rating) {
		this.rating = rating;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
}