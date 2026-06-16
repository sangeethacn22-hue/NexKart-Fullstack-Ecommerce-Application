package com.nexkart.service;

import com.nexkart.dto.ProductDto;
import com.nexkart.dto.ProductDto.Request;
import com.nexkart.model.Category;
import com.nexkart.model.Product;
import com.nexkart.repository.CategoryRepository;
import com.nexkart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService {

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private CategoryRepository categoryRepository;

	public Page<ProductDto.Response> searchProducts(String keyword, Long categoryId, BigDecimal minPrice,
			BigDecimal maxPrice, String brand, Pageable pageable) {
		return productRepository.searchProducts(keyword, categoryId, minPrice, maxPrice, brand, pageable)
				.map(this::toResponse);
	}

	public ProductDto.Response getProductById(Long id) {
		Product product = productRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Product not found: " + id));
		return toResponse(product);
	}

	public ProductDto.Response createProduct(ProductDto.Request request) {
		Product product = new Product();

		product.setName(request.getName());
		product.setDescription(request.getDescription());
		product.setPrice(request.getPrice());
		product.setDiscountPrice(request.getDiscountPrice());
		product.setStock(request.getStock());
		product.setImageUrl(request.getImageUrl());
		product.setImages(request.getImages());
		product.setBrand(request.getBrand());
		product.setFeatured(request.getFeatured() != null ? request.getFeatured() : false);
		product.setStatus(Product.ProductStatus.ACTIVE);
		product.setRating(0.0);
		product.setReviewCount(0);

		if (request.getCategoryId() != null) {
			Category category = categoryRepository.findById(request.getCategoryId())
					.orElseThrow(() -> new RuntimeException("Category not found"));
			product.setCategory(category);
		}

		return toResponse(productRepository.save(product));
	}

	public List<ProductDto.Response> getFeaturedProducts() {
		return productRepository.findByFeaturedTrueAndStatus(Product.ProductStatus.ACTIVE).stream()
				.map(this::toResponse).collect(Collectors.toList());
	}

	public List<ProductDto.Response> getRelatedProducts(Long productId) {
		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new RuntimeException("Product not found"));
		Pageable pageable = PageRequest.of(0, 8);
		return productRepository.findRelatedProducts(product.getCategory().getId(), productId, pageable).stream()
				.map(this::toResponse).collect(Collectors.toList());
	}

	public ProductDto.Response updateProduct(Long id, ProductDto.Request request) {
		Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));

		product.setName(request.getName());
		product.setDescription(request.getDescription());
		product.setPrice(request.getPrice());
		product.setDiscountPrice(request.getDiscountPrice());
		product.setStock(request.getStock());
		product.setImageUrl(request.getImageUrl());
		product.setBrand(request.getBrand());
		product.setFeatured(request.getFeatured());

		if (request.getCategoryId() != null) {
			Category category = categoryRepository.findById(request.getCategoryId())
					.orElseThrow(() -> new RuntimeException("Category not found"));
			product.setCategory(category);
		}
		return toResponse(productRepository.save(product));
	}

	public void deleteProduct(Long id) {
		Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
		product.setStatus(Product.ProductStatus.INACTIVE);
		productRepository.save(product);
	}

	public ProductDto.Response toResponse(Product product) {
		ProductDto.Response response = new ProductDto.Response();
		response.setId(product.getId());
		response.setName(product.getName());
		response.setDescription(product.getDescription());
		response.setPrice(product.getPrice());
		response.setDiscountPrice(product.getDiscountPrice());
		response.setStock(product.getStock());
		response.setImageUrl(product.getImageUrl());
		response.setImages(product.getImages());
		response.setBrand(product.getBrand());
		response.setRating(product.getRating());
		response.setReviewCount(product.getReviewCount());
		response.setStatus(product.getStatus().name());
		response.setFeatured(product.getFeatured());
		if (product.getCategory() != null) {
			response.setCategoryName(product.getCategory().getName());
			response.setCategoryId(product.getCategory().getId());
		}
		return response;
	}

}
