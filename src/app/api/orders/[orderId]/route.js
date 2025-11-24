/**
 * Order Detail API
 * GET /api/orders/[orderId]
 */

import connectDB from "@/lib/database";
import Order from "@/models/Order";
import { verifyAuth } from "@/lib/auth";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  notFoundResponse,
} from "@/lib/apiResponse";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const authResult = await verifyAuth(request);
    if (authResult.error) {
      return unauthorizedResponse(authResult.error);
    }

    const { orderId } = params;

    const order = await Order.findOne({ orderId })
      .populate("items.product", "name image")
      .populate("user", "name email");

    if (!order) {
      return notFoundResponse("Order not found");
    }

    // Check if order belongs to user (or user is admin)
    if (
      order.user._id.toString() !== authResult.userId.toString() &&
      authResult.user.role !== "admin"
    ) {
      return errorResponse("Unauthorized to view this order", 403);
    }

    return successResponse(order);
  } catch (error) {
    console.error("Get order detail error:", error);
    return errorResponse("Failed to get order detail", 500);
  }
}
