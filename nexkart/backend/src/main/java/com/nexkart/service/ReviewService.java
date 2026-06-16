package com.nexkart.service;

import com.nexkart.model.*;
import com.nexkart.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ReviewService {

	@Autowired
	private ReviewRepository reviewRepository;
	@Autowired
	private ProductRepository productRepository;
	@Autowired
	private UserRepository userRepository;

	public Page<Review> getProductReviews(Long productId, Pageable pageable) {
		return reviewRepository.findByProductId(productId, pageable);
	}

	public Review addReview(Long productId, String email, Integer rating, String title, String comment) {
		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new RuntimeException("Product not found"));

		Review review = new Review();
		review.setProduct(product);
		review.setUser(user);
		review.setRating(rating);
		review.setTitle(title);
		review.setComment(comment);

		Review saved = reviewRepository.save(review);

		// Update product rating
		Double avgRating = reviewRepository.findAverageRatingByProductId(productId);
		product.setRating(avgRating != null ? avgRating : 0.0);
		product.setReviewCount(product.getReviewCount() + 1);
		productRepository.save(product);

		return saved;
	}

	public void deleteReview(Long id, String email) {
		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
		Review review = reviewRepository.findById(id).orElseThrow(() -> new RuntimeException("Review not found"));

		if (!review.getUser().getId().equals(user.getId()) && !user.getRole().equals(User.Role.ADMIN)) {
			throw new RuntimeException("Unauthorized");
		}

		reviewRepository.delete(review);

		Double avgRating = reviewRepository.findAverageRatingByProductId(review.getProduct().getId());
		Product product = review.getProduct();
		product.setRating(avgRating != null ? avgRating : 0.0);
		product.setReviewCount(Math.max(0, product.getReviewCount() - 1));
		productRepository.save(product);
	}
}