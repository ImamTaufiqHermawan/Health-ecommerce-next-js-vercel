/**
 * Orders API
 * GET /api/orders - Get user orders
 * GET /api/orders/[orderId] - Get specific order
 */

import connectDB from "@/lib/database";
import Order from "@/models/Order";
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

    const orders = await Order.find({ user: authResult.userId })
      .sort({ createdAt: -1 })
      .populate("items.product", "name image");

    return successResponse({
      orders,
      count: orders.length,
    });
  } catch (error) {
    console.error("Get orders error:", error);
    return errorResponse("Failed to get orders", 500);
  }
}
