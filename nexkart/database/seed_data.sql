-- ============================================================
-- NexKart E-Commerce Database Setup Script
-- Run this before starting the Spring Boot application
-- ============================================================

CREATE DATABASE IF NOT EXISTS nexkart_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE nexkart_db;

-- ============================================================
-- SEED DATA: Categories
-- ============================================================
INSERT IGNORE INTO categories (id, name, description, image_url, parent_id) VALUES
(1, 'Electronics', 'Mobile phones, laptops, gadgets and accessories', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', NULL),
(2, 'Fashion', 'Clothing, footwear and fashion accessories', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400', NULL),
(3, 'Home & Kitchen', 'Furniture, kitchen appliances and home decor', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', NULL),
(4, 'Sports & Fitness', 'Sports equipment, gym gear and outdoor products', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400', NULL),
(5, 'Books', 'Books, magazines and educational material', 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400', NULL),
(6, 'Beauty & Personal Care', 'Skincare, haircare and wellness products', 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400', NULL),
(7, 'Toys & Games', 'Kids toys, board games and puzzles', 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400', NULL),
(8, 'Grocery', 'Daily essentials, fresh food and pantry items', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400', NULL);

-- ============================================================
-- SEED DATA: Admin User (password: admin123)
-- BCrypt hash of "admin123"
-- ============================================================
INSERT IGNORE INTO users (id, first_name, last_name, email, password, phone, role, enabled, created_at, updated_at)
VALUES (1, 'Admin', 'NexKart', 'admin@nexkart.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', -- password: password
  '9999999999', 'ADMIN', true, NOW(), NOW());

-- ============================================================
-- SEED DATA: Sample Products
-- ============================================================
INSERT IGNORE INTO products (id, name, description, price, discount_price, stock, image_url, brand, rating, review_count, featured, status, category_id, created_at, updated_at) VALUES
(1, 'iPhone 15 Pro Max 256GB', 'Experience the pinnacle of smartphone technology with A17 Pro chip, ProMotion OLED display, titanium design, and 48MP camera system.', 134900.00, 129900.00, 45, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600', 'Apple', 4.8, 324, true, 'ACTIVE', 1, NOW(), NOW()),
(2, 'Samsung Galaxy S24 Ultra', 'Samsung S24 Ultra with Snapdragon 8 Gen 3, 200MP camera, built-in S Pen, and stunning 6.8" Dynamic AMOLED display.', 124999.00, 109999.00, 30, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600', 'Samsung', 4.7, 218, true, 'ACTIVE', 1, NOW(), NOW()),
(3, 'MacBook Air M3 13-inch', 'Supercharged by M3 chip. 18 hours battery life, fanless design, Liquid Retina display, and MagSafe charging.', 114900.00, 109900.00, 25, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600', 'Apple', 4.9, 156, true, 'ACTIVE', 1, NOW(), NOW()),
(4, 'Sony WH-1000XM5 Headphones', 'Industry-leading noise cancellation with 30-hour battery life and exceptional sound quality. Perfect for music lovers.', 29990.00, 24990.00, 80, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', 'Sony', 4.6, 489, true, 'ACTIVE', 1, NOW(), NOW()),
(5, 'Nike Air Max 270 React', 'Comfortable daily running shoes with Max Air heel unit and React foam. Available in multiple colorways.', 12995.00, 9999.00, 120, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', 'Nike', 4.5, 267, true, 'ACTIVE', 2, NOW(), NOW()),
(6, 'Adidas Ultraboost 23', 'Premium running shoes with Boost cushioning technology for unmatched energy return and comfort.', 17999.00, 14999.00, 95, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600', 'Adidas', 4.4, 183, false, 'ACTIVE', 2, NOW(), NOW()),
(7, 'Instant Pot Duo 7-in-1', 'Multi-use pressure cooker with 7 appliances in one: pressure cooker, slow cooker, rice cooker, steamer, saute, yogurt maker, and warmer.', 8999.00, 6999.00, 60, 'https://images.unsplash.com/photo-1556909114-4b5a08ef36fa?w=600', 'Instant Pot', 4.7, 892, false, 'ACTIVE', 3, NOW(), NOW()),
(8, 'Yoga Mat Premium Non-Slip', 'Extra thick 6mm TPE yoga mat with alignment lines, carrying strap. Perfect for yoga, pilates and floor exercises.', 2499.00, 1799.00, 200, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600', 'Boldfit', 4.3, 1203, false, 'ACTIVE', 4, NOW(), NOW()),
(9, 'Atomic Habits - James Clear', 'The #1 New York Times bestseller. Tiny changes, remarkable results. A proven framework for improving every day.', 499.00, 349.00, 500, 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=600', 'Penguin Random House', 4.9, 5621, false, 'ACTIVE', 5, NOW(), NOW()),
(10, 'boAt Airdopes 141 TWS', 'Truly wireless earbuds with 42 hours playback, BEAST Mode gaming, IPX4 water resistance and instant voice assistant.', 1799.00, 999.00, 350, 'https://images.unsplash.com/photo-1590658165737-15a047b7c36e?w=600', 'boAt', 4.2, 28473, true, 'ACTIVE', 1, NOW(), NOW()),
(11, 'Levi''s 511 Slim Fit Jeans', 'Classic slim fit jeans in stretch fabric. Iconic 5-pocket styling with a modern, versatile fit.', 3999.00, 2799.00, 150, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600', 'Levi''s', 4.4, 743, false, 'ACTIVE', 2, NOW(), NOW());

-- ============================================================
-- SAMPLE ADMIN QUERY: Check data
-- ============================================================
SELECT 'Categories count:' as info, COUNT(*) as count FROM categories
UNION ALL
SELECT 'Products count:', COUNT(*) FROM products
UNION ALL
SELECT 'Users count:', COUNT(*) FROM users;
