import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { productAPI, categoryAPI } from "../services/api";
import ProductCard from "../components/Product/ProductCard";

const CATEGORY_ICONS = {
  Electronics: "📱",
  Fashion: "👗",
  Home: "🏠",
  Sports: "⚽",
  Books: "📚",
  Beauty: "💄",
  Toys: "🧸",
  Grocery: "🛒",
  Automotive: "🚗",
  Health: "💊",
};

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featRes, catRes] = await Promise.all([
          productAPI.getFeatured(),
          categoryAPI.getAll(),
        ]);

        // Fix: handle both array and page object responses
        const featData = featRes.data;
        const catData = catRes.data;

        // Categories could be array or page object
        if (Array.isArray(catData)) {
          setCategories(catData.slice(0, 8));
        } else if (catData.content) {
          setCategories(catData.content.slice(0, 8));
        } else {
          setCategories([]);
        }

        // Featured could be array or page object
        if (Array.isArray(featData)) {
          setFeatured(featData.slice(0, 8));
        } else if (featData.content) {
          setFeatured(featData.content.slice(0, 8));
        } else {
          setFeatured([]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setCategories([]);
        setFeatured([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <div className="fade-in-up">
                <h1 className="hero-title">
                  Shop Smarter,
                  <br />
                  Live <span className="highlight">Better</span>
                </h1>
                <p
                  style={{
                    fontSize: "1.1rem",
                    color: "rgba(255,255,255,0.8)",
                    marginTop: "1rem",
                    marginBottom: "2rem",
                  }}
                >
                  Discover millions of products across all categories with the
                  best deals, lightning-fast delivery, and easy returns.
                </p>
                <div className="d-flex gap-3 flex-wrap">
                  <Link to="/products" className="btn-nk-primary">
                    Shop Now →
                  </Link>
                  <Link to="/register" className="btn-nk-outline">
                    Join NexKart
                  </Link>
                </div>
                <div
                  className="d-flex gap-4 mt-4"
                  style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}
                >
                  <span>✅ 2Cr+ Products</span>
                  <span>🚚 Free Delivery</span>
                  <span>🔒 Secure Pay</span>
                </div>
              </div>
            </Col>
            <Col lg={6} className="text-center d-none d-lg-block">
              <div style={{ fontSize: "12rem", lineHeight: 1 }}>🛍️</div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section style={{ padding: "4rem 0", background: "#f8f9fa" }}>
          <Container>
            <h2 className="section-title">Shop by Category</h2>
            <Row className="g-3 mt-3">
              {categories.map((cat) => (
                <Col key={cat.id} xs={6} sm={4} md={3} lg={3}>
                  <div
                    className="category-card"
                    onClick={() => navigate(`/products?categoryId=${cat.id}`)}
                  >
                    <div className="category-icon">
                      {CATEGORY_ICONS[cat.name] || "🏷️"}
                    </div>
                    <div className="category-name">{cat.name}</div>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}

      {/* Featured Products */}
      <section style={{ padding: "4rem 0" }}>
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="section-title">Featured Products</h2>
            <Link
              to="/products"
              style={{
                color: "var(--nk-primary)",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              View All →
            </Link>
          </div>
          {loading ? (
            <div className="nexkart-spinner">
              <Spinner animation="border" />
            </div>
          ) : featured.length === 0 ? (
            <div className="text-center py-5">
              <p style={{ color: "#6c757d" }}>
                No featured products yet. Add some from the admin panel!
              </p>
              <Link to="/products" className="btn-nk-primary">
                Browse All Products
              </Link>
            </div>
          ) : (
            <Row className="g-4">
              {featured.map((product) => (
                <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>

      {/* Banner */}
      <section
        style={{
          background: "linear-gradient(135deg, #FF4500, #ff6a33)",
          padding: "4rem 0",
          color: "white",
        }}
      >
        <Container className="text-center">
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: "2rem",
            }}
          >
            🎉 Get 10% OFF Your First Order!
          </h2>
          <p
            style={{
              fontSize: "1.1rem",
              marginTop: "0.5rem",
              marginBottom: "1.5rem",
            }}
          >
            Sign up today and use code <strong>NEXKART10</strong> at checkout.
          </p>
          <Link to="/register" className="btn-nk-outline">
            Create Account
          </Link>
        </Container>
      </section>

      {/* Features */}
      <section style={{ padding: "4rem 0", background: "#f8f9fa" }}>
        <Container>
          <Row className="g-4 text-center">
            {[
              {
                icon: "🚚",
                title: "Free Delivery",
                desc: "On all orders above ₹499",
              },
              {
                icon: "↩️",
                title: "Easy Returns",
                desc: "30-day hassle-free returns",
              },
              {
                icon: "🔒",
                title: "Secure Payment",
                desc: "100% secure transactions",
              },
              {
                icon: "💬",
                title: "24/7 Support",
                desc: "Round the clock assistance",
              },
            ].map((f, i) => (
              <Col key={i} xs={6} md={3}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
                  {f.icon}
                </div>
                <h6 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700 }}>
                  {f.title}
                </h6>
                <p style={{ fontSize: "0.85rem", color: "#6c757d" }}>
                  {f.desc}
                </p>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;
