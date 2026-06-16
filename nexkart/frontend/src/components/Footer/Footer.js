import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => (
  <footer style={{ background: '#1a1a2e', color: 'rgba(255,255,255,0.8)', paddingTop: '3rem', marginTop: 'auto' }}>
    <Container>
      <Row className="mb-4">
        <Col md={4} className="mb-4">
          <h5 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: 'white', fontSize: '1.5rem' }}>
            Nex<span style={{ color: '#FF4500' }}>Kart</span>
          </h5>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Your next-generation shopping destination. Discover millions of products with the best deals, fast delivery, and hassle-free returns.
          </p>
        </Col>
        <Col md={2} className="mb-4">
          <h6 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>Shop</h6>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem' }}>
            <li><Link to="/products" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>All Products</Link></li>
            <li><Link to="/products?category=Electronics" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Electronics</Link></li>
            <li><Link to="/products?category=Fashion" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Fashion</Link></li>
            <li><Link to="/products?category=Home" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Home & Kitchen</Link></li>
          </ul>
        </Col>
        <Col md={2} className="mb-4">
          <h6 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>Account</h6>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem' }}>
            <li><Link to="/profile" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>My Profile</Link></li>
            <li><Link to="/orders" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>My Orders</Link></li>
            <li><Link to="/cart" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>My Cart</Link></li>
          </ul>
        </Col>
        <Col md={4} className="mb-4">
          <h6 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>Why NexKart?</h6>
          <div style={{ fontSize: '0.9rem' }}>
            <div className="d-flex align-items-center mb-2 gap-2">✅ 30-day easy returns</div>
            <div className="d-flex align-items-center mb-2 gap-2">🚚 Free delivery on orders above ₹499</div>
            <div className="d-flex align-items-center mb-2 gap-2">🔒 100% secure payments</div>
            <div className="d-flex align-items-center mb-2 gap-2">⭐ 2 crore+ happy customers</div>
          </div>
        </Col>
      </Row>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', paddingBottom: '1rem', textAlign: 'center', fontSize: '0.85rem' }}>
        © {new Date().getFullYear()} NexKart. All rights reserved. | Made with ❤️ in India
      </div>
    </Container>
  </footer>
);

export default Footer;
