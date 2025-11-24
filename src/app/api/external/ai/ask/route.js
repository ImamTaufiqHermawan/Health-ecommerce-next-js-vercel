/**
 * AI Chatbot API
 * POST /api/external/ai/ask
 */

import connectDB from "@/lib/database";
import aiService from "@/services/aiService";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { question } = body;

    if (!question || question.trim() === "") {
      return errorResponse("Question is required", 400);
    }

    const result = await aiService.getHealthRecommendation(question);

    if (!result.success) {
      return errorResponse(result.message || "AI service error", 500);
    }

    return successResponse(result);
  } catch (error) {
    console.error("AI API error:", error);
    return errorResponse("Failed to process AI request", 500);
  }
}
