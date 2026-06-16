import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const discount = product.discountPrice
    ? Math.round((1 - product.discountPrice / product.price) * 100)
    : null;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      toast.info("Please login to add items to cart");
      navigate("/login");
      return;
    }
    try {
      await addToCart(product.id, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i}>{i < Math.floor(rating || 0) ? "★" : "☆"}</span>
    ));
  };

  return (
    <div className="product-card card">
      <Link
        to={`/products/${product.id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <div className="card-img-wrapper">
          {discount && <span className="badge-discount">-{discount}%</span>}
          <img
            src={
              product.imageUrl ||
              `https://via.placeholder.com/300x220?text=${encodeURIComponent(product.name)}`
            }
            alt={product.name}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
        <div className="card-body">
          {product.brand && (
            <small
              style={{
                color: "#6c757d",
                textTransform: "uppercase",
                fontSize: "0.72rem",
                fontWeight: 600,
              }}
            >
              {product.brand}
            </small>
          )}
          <div className="product-name mt-1">{product.name}</div>
          <div className="star-rating mb-1">
            {renderStars(product.rating)}
            <small style={{ color: "#6c757d", marginLeft: "4px" }}>
              ({product.reviewCount || 0})
            </small>
          </div>
          <div className="product-price">
            ₹
            {product.discountPrice
              ? product.discountPrice.toLocaleString("en-IN")
              : product.price.toLocaleString("en-IN")}
            {product.discountPrice && (
              <span className="original-price">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>
      </Link>
      <div className="card-body pt-0">
        <button
          className="btn-add-cart"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? "Out of Stock" : "🛒 Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
