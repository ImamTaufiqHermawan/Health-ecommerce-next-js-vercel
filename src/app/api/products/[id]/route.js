/**
 * Product Detail API
 * GET /api/products/[id]
 * PUT /api/products/[id] - Update product (Admin only)
 * DELETE /api/products/[id] - Delete product (Admin only)
 */

import connectDB from "@/lib/database";
import Product from "@/models/Product";
import { verifyAdmin } from "@/lib/auth";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from "@/lib/apiResponse";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const product = await Product.findById(id);

    if (!product) {
      return notFoundResponse("Produk tidak ditemukan");
    }

    return successResponse(product);
  } catch (error) {
    console.error("Get product error:", error);
    return errorResponse("Gagal mengambil produk", 500);
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();

    // Verify admin
    const authResult = await verifyAdmin(request);
    if (authResult.error) {
      return errorResponse(authResult.error, authResult.status);
    }

    const { id } = params;
    const body = await request.json();

    const product = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return notFoundResponse("Produk tidak ditemukan");
    }

    return successResponse(product, "Produk berhasil diupdate");
  } catch (error) {
    console.error("Update product error:", error);
    return errorResponse("Gagal mengupdate produk", 500);
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    // Verify admin
    const authResult = await verifyAdmin(request);
    if (authResult.error) {
      return errorResponse(authResult.error, authResult.status);
    }

    const { id } = params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return notFoundResponse("Produk tidak ditemukan");
    }

    return successResponse(null, "Produk berhasil dihapus");
  } catch (error) {
    console.error("Delete product error:", error);
    return errorResponse("Gagal menghapus produk", 500);
  }
}
