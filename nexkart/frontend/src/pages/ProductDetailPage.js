import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Spinner, Badge, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { productAPI, reviewAPI } from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/Product/ProductCard";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: "",
    comment: "",
  });
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, relRes, revRes] = await Promise.all([
          productAPI.getById(id),
          productAPI.getRelated(id),
          reviewAPI.getProductReviews(id),
        ]);
        setProduct(prodRes.data);
        setRelated(relRes.data.slice(0, 4));
        setReviews(revRes.data.content || []);
      } catch (err) {
        toast.error("Product not found");
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    try {
      await addToCart(product.id, qty);
      toast.success("Added to cart!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    try {
      await addToCart(product.id, qty);
      navigate("/cart");
    } catch (err) {
      toast.error("Failed");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    try {
      await reviewAPI.addReview(id, reviewForm);
      toast.success("Review submitted!");
      const revRes = await reviewAPI.getProductReviews(id);
      setReviews(revRes.data.content || []);
      setReviewForm({ rating: 5, title: "", comment: "" });
    } catch (err) {
      toast.error("Failed to submit review");
    }
  };

  if (loading)
    return (
      <div className="nexkart-spinner">
        <Spinner animation="border" />
      </div>
    );
  if (!product) return null;

  const images = [product.imageUrl, ...(product.images || [])].filter(Boolean);
  const discount = product.discountPrice
    ? Math.round((1 - product.discountPrice / product.price) * 100)
    : null;

  return (
    <Container className="py-4">
      <Row className="g-4">
        {/* Images */}
        <Col md={5}>
          <div
            style={{
              borderRadius: "var(--nk-radius)",
              overflow: "hidden",
              background: "#f5f5f5",
              height: "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={images[activeImage] || "https://via.placeholder.com/400"}
              alt={product.name}
              style={{
                maxHeight: "400px",
                maxWidth: "100%",
                objectFit: "contain",
              }}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/400?text=NexKart";
              }}
            />
          </div>
          {images.length > 1 && (
            <div className="d-flex gap-2 mt-2">
              {images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setActiveImage(i)}
                  style={{
                    width: 60,
                    height: 60,
                    border:
                      i === activeImage
                        ? "2px solid var(--nk-primary)"
                        : "2px solid transparent",
                    borderRadius: 8,
                    overflow: "hidden",
                    cursor: "pointer",
                    background: "#f5f5f5",
                  }}
                >
                  <img
                    src={img}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </Col>

        {/* Details */}
        <Col md={7}>
          {product.brand && (
            <small
              style={{
                color: "#6c757d",
                textTransform: "uppercase",
                fontWeight: 700,
                fontSize: "0.75rem",
              }}
            >
              {product.brand}
            </small>
          )}
          <h1
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 700,
              fontSize: "1.6rem",
              marginTop: "0.5rem",
            }}
          >
            {product.name}
          </h1>

          <div className="d-flex align-items-center gap-2 mb-2">
            <span style={{ color: "#FFB800" }}>
              {"★".repeat(Math.floor(product.rating || 0))}
            </span>
            <span style={{ color: "#6c757d", fontSize: "0.9rem" }}>
              ({product.reviewCount} reviews)
            </span>
            <Badge
              bg={product.stock > 0 ? "success" : "danger"}
              style={{ fontSize: "0.75rem" }}
            >
              {product.stock > 0
                ? `In Stock (${product.stock})`
                : "Out of Stock"}
            </Badge>
          </div>

          <div className="mb-3">
            <span
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: "2rem",
                fontWeight: 800,
                color: "var(--nk-primary)",
              }}
            >
              ₹
              {(product.discountPrice || product.price).toLocaleString("en-IN")}
            </span>
            {product.discountPrice && (
              <>
                <span
                  style={{
                    textDecoration: "line-through",
                    color: "#6c757d",
                    marginLeft: "1rem",
                    fontSize: "1.1rem",
                  }}
                >
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                <Badge bg="danger" className="ms-2">
                  {discount}% OFF
                </Badge>
              </>
            )}
          </div>

          <p style={{ color: "#444", lineHeight: 1.7 }}>
            {product.description}
          </p>

          <div className="d-flex align-items-center gap-3 mb-3">
            <span style={{ fontWeight: 600 }}>Quantity:</span>
            <div className="qty-control">
              <button
                className="qty-btn"
                onClick={() => setQty(Math.max(1, qty - 1))}
              >
                −
              </button>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  minWidth: "30px",
                  textAlign: "center",
                }}
              >
                {qty}
              </span>
              <button
                className="qty-btn"
                onClick={() => setQty(Math.min(product.stock, qty + 1))}
              >
                +
              </button>
            </div>
          </div>

          <div className="d-flex gap-3">
            <button
              className="btn-add-cart"
              style={{ width: "auto", padding: "0.75rem 2rem" }}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              🛒 Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              style={{
                background: "var(--nk-secondary)",
                color: "white",
                border: "none",
                padding: "0.75rem 2rem",
                borderRadius: "var(--nk-radius)",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              ⚡ Buy Now
            </button>
          </div>

          <div
            className="d-flex gap-3 mt-3"
            style={{ fontSize: "0.85rem", color: "#6c757d" }}
          >
            <span>🚚 Free delivery on orders above ₹499</span>
            <span>↩️ 30-day returns</span>
          </div>
        </Col>
      </Row>

      {/* Reviews */}
      <div className="mt-5">
        <h4 className="section-title">Customer Reviews</h4>
        {reviews.length === 0 ? (
          <p style={{ color: "#6c757d" }}>
            No reviews yet. Be the first to review!
          </p>
        ) : (
          reviews.map((r) => (
            <div
              key={r.id}
              style={{
                background: "white",
                borderRadius: "var(--nk-radius)",
                padding: "1rem",
                marginBottom: "1rem",
                boxShadow: "var(--nk-shadow)",
              }}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <span style={{ color: "#FFB800" }}>
                    {"★".repeat(r.rating)}
                    {"☆".repeat(5 - r.rating)}
                  </span>
                  <strong className="ms-2">{r.title}</strong>
                </div>
                <small style={{ color: "#6c757d" }}>
                  {r.user?.firstName} {r.user?.lastName}
                </small>
              </div>
              <p className="mt-1 mb-0" style={{ color: "#444" }}>
                {r.comment}
              </p>
            </div>
          ))
        )}

        {isAuthenticated() && (
          <div
            style={{
              background: "white",
              borderRadius: "var(--nk-radius)",
              padding: "1.5rem",
              boxShadow: "var(--nk-shadow)",
              marginTop: "1.5rem",
            }}
          >
            <h6 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700 }}>
              Write a Review
            </h6>
            <Form onSubmit={handleReviewSubmit}>
              <Form.Group className="mb-2">
                <Form.Label>Rating</Form.Label>
                <Form.Select
                  value={reviewForm.rating}
                  onChange={(e) =>
                    setReviewForm((p) => ({
                      ...p,
                      rating: parseInt(e.target.value),
                    }))
                  }
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} Stars
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Control
                  placeholder="Review title"
                  value={reviewForm.title}
                  onChange={(e) =>
                    setReviewForm((p) => ({ ...p, title: e.target.value }))
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Share your experience..."
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm((p) => ({ ...p, comment: e.target.value }))
                  }
                  required
                />
              </Form.Group>
              <button
                type="submit"
                className="btn-nk-primary"
                style={{ padding: "0.5rem 1.5rem" }}
              >
                Submit Review
              </button>
            </Form>
          </div>
        )}
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-5">
          <h4 className="section-title">Related Products</h4>
          <Row className="g-3 mt-2">
            {related.map((p) => (
              <Col key={p.id} xs={12} sm={6} md={3}>
                <ProductCard product={p} />
              </Col>
            ))}
          </Row>
        </div>
      )}
    </Container>
  );
};

export default ProductDetailPage;
