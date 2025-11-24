/**
 * Products API - List and Create
 * GET /api/products - Get all products
 * POST /api/products - Create product (Admin only)
 */

import connectDB from "@/lib/database";
import Product from "@/models/Product";
import { verifyAuth, verifyAdmin } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const skip = (page - 1) * limit;

    // Build query
    let query = { isActive: true };

    if (category && category !== "all") {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { manufacturer: { $regex: search, $options: "i" } },
      ];
    }

    // Execute query with pagination
    const [products, total] = await Promise.all([
      Product.find(query).limit(limit).skip(skip).sort({ createdAt: -1 }),
      Product.countDocuments(query),
    ]);

    return successResponse({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    return errorResponse("Gagal mengambil produk", 500);
  }
}

export async function POST(request) {
  try {
    await connectDB();

    // Verify admin
    const authResult = await verifyAdmin(request);
    if (authResult.error) {
      return errorResponse(authResult.error, authResult.status);
    }

    const body = await request.json();
    const { name, category, price, stock, description, manufacturer, image } =
      body;

    // Validation
    if (!name || !category || price === undefined || stock === undefined) {
      return errorResponse("Nama, kategori, harga, dan stok wajib diisi", 400);
    }

    // Create product
    const product = await Product.create({
      name,
      category,
      price,
      stock,
      description,
      manufacturer,
      image,
    });

    return successResponse(product, "Produk berhasil ditambahkan", 201);
  } catch (error) {
    console.error("Create product error:", error);
    return errorResponse("Gagal menambahkan produk", 500);
  }
}
