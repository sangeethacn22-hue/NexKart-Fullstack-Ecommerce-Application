import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { userAPI, orderAPI } from "../services/api";
import { useCart } from "../context/CartContext";

const CheckoutPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });
  const { cart } = useCart();
  const navigate = useNavigate();

  // Load addresses when page opens
  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const res = await userAPI.getAddresses();
      console.log("Addresses loaded:", res.data);

      // Handle different response formats
      let addressList = [];
      if (Array.isArray(res.data)) {
        addressList = res.data;
      } else if (res.data && Array.isArray(res.data.content)) {
        addressList = res.data.content;
      }

      setAddresses(addressList);

      // Auto select first address
      if (addressList.length > 0) {
        setSelectedAddress(addressList[0].id);
      }
    } catch (err) {
      console.error("Failed to load addresses:", err);
      toast.error("Failed to load addresses");
    }
  };

  const handleAddressFieldChange = (field, value) => {
    setNewAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddAddress = async () => {
    // Validate required fields
    if (
      !newAddress.name ||
      !newAddress.phone ||
      !newAddress.addressLine1 ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.pincode
    ) {
      toast.error("Please fill all required address fields");
      return;
    }

    try {
      const res = await userAPI.addAddress(newAddress);
      console.log("Address saved:", res.data);

      // Add new address to list
      const saved = res.data;
      setAddresses((prev) => [...prev, saved]);
      setSelectedAddress(saved.id);
      setShowNewAddress(false);

      // Reset form
      setNewAddress({
        name: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
      });

      toast.success("Address saved successfully!");
    } catch (err) {
      console.error("Failed to save address:", err);
      toast.error("Failed to save address. Please try again.");
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    if (!cart.items || cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);
    try {
      const res = await orderAPI.placeOrder({
        addressId: selectedAddress,
        paymentMethod: paymentMethod,
        notes: "",
      });
      toast.success("Order placed successfully!");
      navigate(`/orders/${res.data.id}`);
    } catch (err) {
      console.error("Order failed:", err);
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const shippingFee = cart.totalAmount > 499 ? 0 : 49;
  const finalTotal = Number(cart.totalAmount || 0) + shippingFee;

  const paymentOptions = [
    { id: "COD", label: "💵 Cash on Delivery" },
    { id: "UPI", label: "📱 UPI (GPay/PhonePe/Paytm)" },
    { id: "CARD", label: "💳 Credit/Debit Card" },
    { id: "NET_BANKING", label: "🏦 Net Banking" },
  ];

  return (
    <Container className="py-4">
      <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800 }}>
        Checkout
      </h3>

      <Row className="g-4 mt-1">
        {/* Left Side */}
        <Col lg={8}>
          {/* Delivery Address Section */}
          <div
            style={{
              background: "white",
              borderRadius: "var(--nk-radius)",
              padding: "1.5rem",
              boxShadow: "var(--nk-shadow)",
              marginBottom: "1.5rem",
            }}
          >
            <h5 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700 }}>
              📍 Delivery Address
            </h5>

            {/* Show saved addresses */}
            {addresses.length === 0 && !showNewAddress && (
              <div
                style={{
                  padding: "1rem",
                  background: "#f8f9fa",
                  borderRadius: 8,
                  marginBottom: "1rem",
                  color: "#6c757d",
                  textAlign: "center",
                }}
              >
                No saved addresses. Please add a new address below.
              </div>
            )}

            {/* Address List */}
            {addresses.map((addr) => (
              <div
                key={addr.id}
                onClick={() => setSelectedAddress(addr.id)}
                style={{
                  border:
                    selectedAddress === addr.id
                      ? "2px solid var(--nk-primary)"
                      : "2px solid #eee",
                  borderRadius: 8,
                  padding: "1rem",
                  marginBottom: "0.75rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.75rem",
                  background: selectedAddress === addr.id ? "#fff5f2" : "white",
                }}
              >
                <input
                  type="radio"
                  checked={selectedAddress === addr.id}
                  onChange={() => setSelectedAddress(addr.id)}
                  style={{ marginTop: 3 }}
                />
                <div>
                  <strong>{addr.name}</strong>
                  {" | "}
                  <span>{addr.phone}</span>
                  <br />
                  <small style={{ color: "#6c757d" }}>
                    {addr.addressLine1}
                    {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                    {", "}
                    {addr.city}, {addr.state} - {addr.pincode}
                    {", "}
                    {addr.country}
                  </small>
                </div>
              </div>
            ))}

            {/* Add New Address Button */}
            <button
              onClick={() => setShowNewAddress(!showNewAddress)}
              style={{
                background: "none",
                border: "2px dashed #ccc",
                borderRadius: 8,
                padding: "0.75rem 1rem",
                cursor: "pointer",
                color: "var(--nk-primary)",
                fontWeight: 600,
                width: "100%",
                marginTop: "0.5rem",
                fontSize: "0.95rem",
              }}
            >
              {showNewAddress ? "✕ Cancel" : "+ Add New Address"}
            </button>

            {/* New Address Form */}
            {showNewAddress && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  background: "#f8f9fa",
                  borderRadius: 8,
                }}
              >
                <h6 style={{ fontWeight: 700, marginBottom: "1rem" }}>
                  New Address
                </h6>
                <Row className="g-2">
                  <Col sm={6}>
                    <Form.Control
                      placeholder="Full Name *"
                      value={newAddress.name}
                      onChange={(e) =>
                        handleAddressFieldChange("name", e.target.value)
                      }
                    />
                  </Col>
                  <Col sm={6}>
                    <Form.Control
                      placeholder="Phone Number *"
                      value={newAddress.phone}
                      onChange={(e) =>
                        handleAddressFieldChange("phone", e.target.value)
                      }
                    />
                  </Col>
                  <Col sm={12}>
                    <Form.Control
                      placeholder="Address Line 1 (House No, Street) *"
                      value={newAddress.addressLine1}
                      onChange={(e) =>
                        handleAddressFieldChange("addressLine1", e.target.value)
                      }
                    />
                  </Col>
                  <Col sm={12}>
                    <Form.Control
                      placeholder="Address Line 2 (Area, Landmark) - Optional"
                      value={newAddress.addressLine2}
                      onChange={(e) =>
                        handleAddressFieldChange("addressLine2", e.target.value)
                      }
                    />
                  </Col>
                  <Col sm={4}>
                    <Form.Control
                      placeholder="City *"
                      value={newAddress.city}
                      onChange={(e) =>
                        handleAddressFieldChange("city", e.target.value)
                      }
                    />
                  </Col>
                  <Col sm={4}>
                    <Form.Control
                      placeholder="State *"
                      value={newAddress.state}
                      onChange={(e) =>
                        handleAddressFieldChange("state", e.target.value)
                      }
                    />
                  </Col>
                  <Col sm={4}>
                    <Form.Control
                      placeholder="Pincode *"
                      value={newAddress.pincode}
                      onChange={(e) =>
                        handleAddressFieldChange("pincode", e.target.value)
                      }
                    />
                  </Col>
                  <Col sm={12}>
                    <button
                      onClick={handleAddAddress}
                      className="btn-nk-primary"
                      style={{ padding: "0.6rem 1.5rem" }}
                    >
                      💾 Save Address
                    </button>
                  </Col>
                </Row>
              </div>
            )}
          </div>

          {/* Payment Method Section */}
          <div
            style={{
              background: "white",
              borderRadius: "var(--nk-radius)",
              padding: "1.5rem",
              boxShadow: "var(--nk-shadow)",
            }}
          >
            <h5 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700 }}>
              💳 Payment Method
            </h5>

            {paymentOptions.map((pm) => (
              <div
                key={pm.id}
                onClick={() => setPaymentMethod(pm.id)}
                style={{
                  border:
                    paymentMethod === pm.id
                      ? "2px solid var(--nk-primary)"
                      : "2px solid #eee",
                  borderRadius: 8,
                  padding: "0.75rem 1rem",
                  marginBottom: "0.5rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  background: paymentMethod === pm.id ? "#fff5f2" : "white",
                }}
              >
                <input
                  type="radio"
                  checked={paymentMethod === pm.id}
                  onChange={() => setPaymentMethod(pm.id)}
                />
                <span style={{ fontWeight: 500 }}>{pm.label}</span>
              </div>
            ))}
          </div>
        </Col>

        {/* Right Side - Order Summary */}
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
                marginBottom: "1rem",
              }}
            >
              Order Summary
            </h5>

            {/* Cart Items */}
            {cart.items &&
              cart.items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                    fontSize: "0.85rem",
                  }}
                >
                  <span style={{ maxWidth: "70%", color: "#444" }}>
                    {item.productName} × {item.quantity}
                  </span>
                  <span style={{ fontWeight: 600 }}>
                    ₹{Number(item.subtotal).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}

            <hr />

            {/* Price Breakdown */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.5rem",
              }}
            >
              <span>Subtotal</span>
              <span>
                ₹{Number(cart.totalAmount || 0).toLocaleString("en-IN")}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <span>Delivery</span>
              <span style={{ color: shippingFee === 0 ? "green" : "inherit" }}>
                {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
              </span>
            </div>

            {shippingFee > 0 && (
              <small style={{ color: "#6c757d", fontSize: "0.78rem" }}>
                Add ₹{499 - Number(cart.totalAmount)} more for FREE delivery
              </small>
            )}

            <hr />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 700,
                fontSize: "1.1rem",
                marginBottom: "1.5rem",
              }}
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

            {/* Place Order Button */}
            <button
              className="btn-nk-primary w-100"
              onClick={handlePlaceOrder}
              disabled={loading || !selectedAddress}
              style={{
                opacity: !selectedAddress || loading ? 0.7 : 1,
                cursor: !selectedAddress || loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "⏳ Placing Order..." : "✅ Place Order"}
            </button>

            {!selectedAddress && (
              <p
                style={{
                  color: "#dc3545",
                  fontSize: "0.8rem",
                  textAlign: "center",
                  marginTop: "0.5rem",
                }}
              >
                ⚠️ Please select or add a delivery address
              </p>
            )}

            <a
              href="/cart"
              style={{
                display: "block",
                textAlign: "center",
                marginTop: "1rem",
                color: "var(--nk-primary)",
                textDecoration: "none",
                fontSize: "0.9rem",
              }}
            >
              ← Back to Cart
            </a>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
