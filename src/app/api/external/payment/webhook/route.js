/**
 * Payment Webhook - Midtrans Notification
 * POST /api/external/payment/webhook
 */

import connectDB from "@/lib/database";
import Order from "@/models/Order";
import midtransService from "@/services/midtransService";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function POST(request) {
  try {
    await connectDB();

    const notification = await request.json();

    console.log("Webhook received:", {
      orderId: notification.order_id,
      status: notification.transaction_status,
    });

    // Handle notification
    const result = midtransService.handleNotification(notification);

    if (!result.success) {
      return errorResponse(result.message, 400);
    }

    // Update order in database
    const order = await Order.findOne({ orderId: result.orderId });

    if (!order) {
      console.warn(`Order not found: ${result.orderId}`);
      return errorResponse("Order not found", 404);
    }

    // Update order status
    order.status = result.status;
    order.transactionStatus = result.transactionStatus;
    order.midtransData = {
      transactionId: notification.transaction_id,
      statusCode: notification.status_code,
      grossAmount: notification.gross_amount,
      paymentType: notification.payment_type,
      transactionTime: notification.transaction_time,
      settlementTime: notification.settlement_time,
    };

    await order.save();

    console.log(`Order ${result.orderId} updated to status: ${result.status}`);

    return successResponse({
      message: "Webhook processed successfully",
      orderId: result.orderId,
      status: result.status,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return errorResponse("Webhook processing failed", 500);
  }
}
