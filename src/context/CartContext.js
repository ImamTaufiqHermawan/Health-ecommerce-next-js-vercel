/**
 * Cart Context Provider
 */

"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      fetchCart();
    } else {
      setCart({ items: [], total: 0 });
    }
  }, [isLoggedIn]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");
      const response = await fetch("/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        // API returns { data: { cart: [], totalItems, totalPrice } }
        const cartData = result.data?.cart || [];
        const totalPrice = result.data?.totalPrice || 0;

        // Filter out items with null product
        const validItems = cartData.filter((item) => item.product !== null);

        setCart({
          items: validItems,
          total: totalPrice,
        });
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCart({ items: [], total: 0 });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (response.ok) {
        await fetchCart();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to add to cart:", error);
      return false;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`/api/cart/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });

      if (response.ok) {
        await fetchCart();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to update cart:", error);
      return false;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`/api/cart/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchCart();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      return false;
    }
  };

  const clearCart = () => {
    setCart({ items: [], total: 0 });
  };

  const cartItems = Array.isArray(cart?.items) ? cart.items : [];
  const cartTotal = cart?.total || 0;
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart: cartItems,
        loading,
        cartTotal,
        cartCount,
        addToCart,
        updateCartItem: updateQuantity,
        removeFromCart,
        clearCart,
        refetch: fetchCart,
        isLoading: loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
