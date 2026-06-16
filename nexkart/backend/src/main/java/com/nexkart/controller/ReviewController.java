package com.nexkart.controller;

import com.nexkart.model.Review;
import com.nexkart.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<Page<Review>> getProductReviews(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(reviewService.getProductReviews(productId, pageable));
    }

    @PostMapping("/product/{productId}")
    public ResponseEntity<Review> addReview(@PathVariable Long productId,
                                             @RequestBody Map<String, Object> request,
                                             Authentication authentication) {
        Integer rating = Integer.valueOf(request.get("rating").toString());
        String title = (String) request.get("title");
        String comment = (String) request.get("comment");
        return ResponseEntity.ok(reviewService.addReview(productId, authentication.getName(), rating, title, comment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id, Authentication authentication) {
        reviewService.deleteReview(id, authentication.getName());
        return ResponseEntity.ok(Map.of("message", "Review deleted"));
    }
}
