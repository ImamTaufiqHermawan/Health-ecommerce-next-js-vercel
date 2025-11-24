/**
 * Cart API
 * GET /api/cart - Get user's cart
 * POST /api/cart - Add item to cart
 * PUT /api/cart/[productId] - Update cart item quantity
 * DELETE /api/cart/[productId] - Remove item from cart
 */

import connectDB from "@/lib/database";
import User from "@/models/User";
import Product from "@/models/Product";
import { verifyAuth } from "@/lib/auth";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
} from "@/lib/apiResponse";

export async function GET(request) {
  try {
    await connectDB();

    const authResult = await verifyAuth(request);
    if (authResult.error) {
      return unauthorizedResponse(authResult.error);
    }

    const user = await User.findById(authResult.userId).populate(
      "cart.product"
    );

    if (!user) {
      return errorResponse("User tidak ditemukan", 404);
    }

    // Filter out null products (deleted products)
    const validCart = user.cart.filter((item) => item.product !== null);

    return successResponse({
      cart: validCart,
      totalItems: validCart.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: validCart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      ),
    });
  } catch (error) {
    console.error("Get cart error:", error);
    return errorResponse("Gagal mengambil cart", 500);
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const authResult = await verifyAuth(request);
    if (authResult.error) {
      return unauthorizedResponse(authResult.error);
    }

    const body = await request.json();
    const { productId, quantity } = body;

    if (!productId || !quantity || quantity < 1) {
      return errorResponse("ProductId dan quantity wajib diisi", 400);
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse("Produk tidak ditemukan", 404);
    }

    const user = await User.findById(authResult.userId);

    // Check if product already in cart
    const existingItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({
        product: productId,
        quantity,
      });
    }

    await user.save();
    await user.populate("cart.product");

    return successResponse(user.cart, "Produk berhasil ditambahkan ke cart");
  } catch (error) {
    console.error("Add to cart error:", error);
    return errorResponse("Gagal menambahkan ke cart", 500);
  }
}
