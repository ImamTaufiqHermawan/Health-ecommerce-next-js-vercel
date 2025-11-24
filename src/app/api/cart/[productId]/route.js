/**
 * Cart Item Update/Delete API
 * PUT /api/cart/[productId] - Update quantity
 * DELETE /api/cart/[productId] - Remove item
 */

import connectDB from "@/lib/database";
import User from "@/models/User";
import { verifyAuth } from "@/lib/auth";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
} from "@/lib/apiResponse";

export async function PUT(request, { params }) {
  try {
    await connectDB();

    const authResult = await verifyAuth(request);
    if (authResult.error) {
      return unauthorizedResponse(authResult.error);
    }

    const { productId } = params;
    const body = await request.json();
    const { quantity } = body;

    if (!quantity || quantity < 1) {
      return errorResponse("Quantity harus lebih dari 0", 400);
    }

    const user = await User.findById(authResult.userId);
    const cartItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (!cartItem) {
      return errorResponse("Produk tidak ada di cart", 404);
    }

    cartItem.quantity = quantity;
    await user.save();
    await user.populate("cart.product");

    return successResponse(user.cart, "Cart berhasil diupdate");
  } catch (error) {
    console.error("Update cart error:", error);
    return errorResponse("Gagal mengupdate cart", 500);
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const authResult = await verifyAuth(request);
    if (authResult.error) {
      return unauthorizedResponse(authResult.error);
    }

    const { productId } = params;

    const user = await User.findById(authResult.userId);
    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId
    );

    await user.save();
    await user.populate("cart.product");

    return successResponse(user.cart, "Produk berhasil dihapus dari cart");
  } catch (error) {
    console.error("Delete cart error:", error);
    return errorResponse("Gagal menghapus dari cart", 500);
  }
}
