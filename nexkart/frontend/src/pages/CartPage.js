import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const { cart, updateItem, removeItem } = useCart();
  const navigate = useNavigate();

  const handleQty = async (itemId, newQty) => {
    try {
      await updateItem(itemId, newQty);
    } catch (err) {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeItem(itemId);
      toast.success("Item removed");
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const shippingFee = cart.totalAmount > 499 ? 0 : 49;
  const finalTotal = Number(cart.totalAmount || 0) + shippingFee;

  if (!cart.items || cart.items.length === 0) {
    return (
      <Container className="py-5 text-center">
        <div style={{ fontSize: "5rem" }}>🛒</div>
        <h4 style={{ fontFamily: "Syne, sans-serif" }}>Your cart is empty</h4>
        <p style={{ color: "#6c757d" }}>
          Add some products to your cart to get started!
        </p>
        <Link to="/products" className="btn-nk-primary">
          Shop Now
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800 }}>
        My Cart ({cart.items.length} items)
      </h3>
      <Row className="g-4 mt-1">
        <Col lg={8}>
          {cart.items.map((item) => (
            <div key={item.id} className="cart-item">
              <Row className="align-items-center">
                <Col xs={3} sm={2}>
                  <img
                    src={item.productImage || "https://via.placeholder.com/80"}
                    alt={item.productName}
                    style={{
                      width: "100%",
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/80";
                    }}
                  />
                </Col>
                <Col xs={9} sm={5}>
                  <Link
                    to={`/products/${item.productId}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                      {item.productName}
                    </div>
                  </Link>
                  <div
                    style={{
                      color: "var(--nk-primary)",
                      fontWeight: 700,
                      marginTop: "0.3rem",
                    }}
                  >
                    ₹
                    {(item.discountPrice || item.price).toLocaleString("en-IN")}
                  </div>
                </Col>
                <Col xs={6} sm={3} className="mt-2 mt-sm-0">
                  <div className="qty-control">
                    <button
                      className="qty-btn"
                      onClick={() => handleQty(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <span
                      style={{
                        fontWeight: 700,
                        minWidth: 30,
                        textAlign: "center",
                      }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      className="qty-btn"
                      onClick={() => handleQty(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>
                </Col>
                <Col xs={6} sm={2} className="text-end mt-2 mt-sm-0">
                  <div
                    style={{ fontWeight: 700, fontFamily: "Syne, sans-serif" }}
                  >
                    ₹{Number(item.subtotal).toLocaleString("en-IN")}
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#dc3545",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      marginTop: "0.3rem",
                    }}
                  >
                    🗑 Remove
                  </button>
                </Col>
              </Row>
            </div>
          ))}
        </Col>

        <Col lg={4}>
          <div
            style={{
              background: "white",
              borderRadius: "var(--nk-radius)",
              padding: "1.5rem",
              boxShadow: "var(--nk-shadow)",
              position: "sticky",
              top: "80px",
            }}
          >
            <h5
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                borderBottom: "2px solid #f0f0f0",
                paddingBottom: "0.75rem",
              }}
            >
              Order Summary
            </h5>
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal ({cart.items.length} items)</span>
              <span>₹{Number(cart.totalAmount).toLocaleString("en-IN")}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Delivery</span>
              <span style={{ color: shippingFee === 0 ? "green" : "inherit" }}>
                {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
              </span>
            </div>
            {shippingFee > 0 && (
              <small style={{ color: "#6c757d", fontSize: "0.8rem" }}>
                Add ₹{499 - cart.totalAmount} more for free delivery
              </small>
            )}
            <hr />
            <div
              className="d-flex justify-content-between mb-3"
              style={{ fontWeight: 700, fontSize: "1.1rem" }}
            >
              <span>Total</span>
              <span
                style={{
                  color: "var(--nk-primary)",
                  fontFamily: "Syne, sans-serif",
                }}
              >
                ₹{finalTotal.toLocaleString("en-IN")}
              </span>
            </div>
            <button
              className="btn-nk-primary w-100"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout →
            </button>
            <Link
              to="/products"
              style={{
                display: "block",
                textAlign: "center",
                marginTop: "1rem",
                color: "var(--nk-primary)",
                textDecoration: "none",
                fontSize: "0.9rem",
              }}
            >
              ← Continue Shopping
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
