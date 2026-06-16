import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { cartAPI } from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    totalItems: 0,
    totalAmount: 0,
  });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchCart = useCallback(async () => {
    // Only fetch if user is logged in
    if (!isAuthenticated()) {
      setCart({ items: [], totalItems: 0, totalAmount: 0 });
      return;
    }
    try {
      const res = await cartAPI.getCart();
      if (res.data) {
        setCart(res.data);
      }
    } catch (err) {
      // 403 means not logged in - clear cart silently
      if (err.response?.status === 403 || err.response?.status === 401) {
        setCart({ items: [], totalItems: 0, totalAmount: 0 });
      } else {
        console.error("Error fetching cart:", err);
      }
    }
  }, [isAuthenticated]);

  // Fetch cart when login state changes
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated()) {
      throw new Error("Please login first");
    }
    setLoading(true);
    try {
      const res = await cartAPI.addItem(productId, quantity);
      if (res.data) {
        setCart(res.data);
      }
      return true;
    } catch (err) {
      console.error("Add to cart error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (cartItemId, quantity) => {
    setLoading(true);
    try {
      const res = await cartAPI.updateItem(cartItemId, quantity);
      if (res.data) {
        setCart(res.data);
      }
    } catch (err) {
      console.error("Update cart error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (cartItemId) => {
    setLoading(true);
    try {
      await cartAPI.removeItem(cartItemId);
      await fetchCart();
    } catch (err) {
      console.error("Remove item error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      setCart({ items: [], totalItems: 0, totalAmount: 0 });
    } catch (err) {
      console.error("Clear cart error:", err);
      throw err;
    }
  };

  // Cart item count for navbar badge
  const cartCount = cart.items ? cart.items.length : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateItem,
        removeItem,
        clearCart,
        fetchCart,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
