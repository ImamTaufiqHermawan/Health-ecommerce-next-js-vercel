/**
 * Midtrans Payment Service for Next.js
 */

import axios from "axios";
import crypto from "crypto";
import https from "https";

class MidtransService {
  constructor() {
    this.serverKey = process.env.MIDTRANS_SERVER_KEY;
    this.clientKey = process.env.MIDTRANS_CLIENT_KEY;
    this.isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
    this.snapURL = this.isProduction
      ? "https://app.midtrans.com/snap/v1/transactions"
      : "https://app.sandbox.midtrans.com/snap/v1/transactions";

    // Create axios instance with SSL bypass for development
    this.axiosInstance = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: process.env.NODE_ENV === "production",
      }),
    });

    if (!this.serverKey) {
      console.warn(
        "MIDTRANS_SERVER_KEY not set. Payment features will not work."
      );
    }
  }

  async createTransaction(orderData) {
    try {
      console.log("Midtrans createTransaction called with:", orderData);

      if (!this.serverKey) {
        throw new Error("MIDTRANS_SERVER_KEY is not configured.");
      }

      if (
        !orderData.orderId ||
        !orderData.items ||
        orderData.items.length === 0
      ) {
        throw new Error("Missing required fields: orderId or items");
      }

      const itemDetails = orderData.items.map((item, index) => {
        const itemPrice =
          typeof item.price === "number"
            ? item.price
            : parseInt(item.price) || 0;
        const itemQuantity = item.quantity || 1;

        if (!item.name) {
          throw new Error(`Item at index ${index} is missing name`);
        }

        if (itemPrice <= 0) {
          throw new Error(
            `Item "${item.name}" has invalid price: ${item.price}`
          );
        }

        return {
          id: String(item.id || item._id || `item-${index}`),
          price: itemPrice,
          quantity: itemQuantity,
          name: item.name,
        };
      });

      const grossAmount = itemDetails.reduce((sum, item) => {
        return sum + item.price * item.quantity;
      }, 0);

      if (grossAmount <= 0 || isNaN(grossAmount)) {
        throw new Error(`Invalid gross_amount: ${grossAmount}`);
      }

      const baseURL = this.isProduction
        ? process.env.NEXT_PUBLIC_API_URL || "https://yourdomain.com"
        : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

      const parameter = {
        transaction_details: {
          order_id: String(orderData.orderId),
          gross_amount: grossAmount,
        },
        customer_details: {
          first_name: orderData.customerName || "Customer",
          email: orderData.customerEmail || "customer@example.com",
          phone: orderData.customerPhone || "",
        },
        item_details: itemDetails,
        callbacks: {
          finish: `${baseURL}/order-success?order_id=${orderData.orderId}`,
          error: `${baseURL}/checkout?error=payment_failed`,
          pending: `${baseURL}/order-success?order_id=${orderData.orderId}&status=pending`,
        },
      };

      const authString = Buffer.from(`${this.serverKey}:`).toString("base64");

      console.log("Sending request to Midtrans:", this.snapURL);
      console.log("Request parameter:", JSON.stringify(parameter, null, 2));

      const response = await this.axiosInstance.post(this.snapURL, parameter, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Basic ${authString}`,
        },
        timeout: 30000,
      });

      console.log("Midtrans response:", response.data);

      if (!response.data || !response.data.token) {
        throw new Error("Invalid response from Midtrans: missing token");
      }

      return {
        success: true,
        token: response.data.token,
        redirectUrl: response.data.redirect_url,
        paymentUrl: response.data.redirect_url,
      };
    } catch (error) {
      if (error.response) {
        const errorData = error.response.data;
        console.error("Midtrans API Error:", errorData);

        if (error.response.status === 401) {
          return {
            success: false,
            message: "Midtrans authentication failed. Check SERVER_KEY",
          };
        }

        return {
          success: false,
          message: errorData.error_messages?.[0] || "Payment creation failed",
          error: errorData.error_messages || errorData,
        };
      }

      return {
        success: false,
        message: error.message || "Payment creation failed",
      };
    }
  }

  verifySignatureKey(orderId, statusCode, grossAmount, serverKey) {
    if (!serverKey) return null;
    const signatureString = `${orderId}${statusCode}${grossAmount}${serverKey}`;
    return crypto.createHash("sha512").update(signatureString).digest("hex");
  }

  handleNotification(notification) {
    if (notification.signature_key) {
      const hash = this.verifySignatureKey(
        notification.order_id,
        notification.status_code,
        notification.gross_amount,
        this.serverKey
      );

      if (hash !== notification.signature_key) {
        return {
          success: false,
          message: "Invalid signature",
        };
      }
    }

    let orderStatus;
    switch (notification.transaction_status) {
      case "settlement":
      case "capture":
        orderStatus = "paid";
        break;
      case "pending":
        orderStatus = "pending";
        break;
      default:
        orderStatus = "failed";
    }

    return {
      success: true,
      status: orderStatus,
      orderId: notification.order_id,
      transactionStatus: notification.transaction_status,
      grossAmount: notification.gross_amount,
    };
  }
}

export default new MidtransService();
