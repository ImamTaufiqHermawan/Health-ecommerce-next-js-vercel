/**
 * Payment API - Create Payment
 * POST /api/external/payment/create
 */

import connectDB from "@/lib/database";
import User from "@/models/User";
import Order from "@/models/Order";
import midtransService from "@/services/midtransService";
import { verifyAuth } from "@/lib/auth";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
} from "@/lib/apiResponse";

export async function POST(request) {
  try {
    await connectDB();

    const authResult = await verifyAuth(request);
    if (authResult.error) {
      return unauthorizedResponse(authResult.error);
    }

    let body;
    try {
      body = await request.json();
    } catch (jsonError) {
      console.error("JSON parse error:", jsonError);
      return errorResponse("Invalid request body", 400);
    }

    console.log("Payment request body:", body);
    const { items, customerDetails } = body;

    if (!items || items.length === 0) {
      return errorResponse("Items cannot be empty", 400);
    }

    // Generate unique order ID
    const orderId = `ORDER-${Date.now()}-${authResult.userId
      .toString()
      .slice(-6)}`;

    // Calculate total
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Create order in database
    const order = await Order.create({
      orderId,
      user: authResult.userId,
      items,
      totalAmount,
      status: "pending",
      customerDetails: {
        name: customerDetails?.name || authResult.user.name,
        email: customerDetails?.email || authResult.user.email,
        phone: customerDetails?.phone || authResult.user.phone || "",
        address: customerDetails?.address || authResult.user.address || "",
      },
    });

    // Create payment with Midtrans
    console.log("Creating payment with orderId:", orderId);
    const paymentResult = await midtransService.createTransaction({
      orderId,
      items,
      customerName: order.customerDetails.name,
      customerEmail: order.customerDetails.email,
      customerPhone: order.customerDetails.phone,
    });

    console.log("Payment result:", paymentResult);

    if (!paymentResult.success) {
      // Update order status to failed
      order.status = "failed";
      await order.save();

      console.error("Payment failed:", paymentResult.message);
      return errorResponse(
        paymentResult.message || "Payment creation failed",
        500
      );
    }

    // Clear user cart after successful payment creation
    if (authResult.userId) {
      await User.findByIdAndUpdate(authResult.userId, { cart: [] });
    }

    return successResponse({
      orderId,
      paymentToken: paymentResult.token,
      paymentUrl: paymentResult.redirectUrl,
    });
  } catch (error) {
    console.error("Payment create error:", error);
    return errorResponse("Failed to create payment", 500);
  }
}
