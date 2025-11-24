/**
 * Health Check API
 * GET /api/health
 */

import { successResponse } from "@/lib/apiResponse";

export async function GET() {
  return successResponse({
    message: "Health E-Commerce API with External Integrations",
    features: ["AI Chatbot", "Kemenkes API", "Midtrans Payment"],
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
}
