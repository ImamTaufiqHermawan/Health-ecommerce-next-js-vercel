/**
 * Auth API - Register
 * POST /api/auth/register
 */

import connectDB from "@/lib/database";
import User from "@/models/User";
import { generateToken } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import {
  validateEmail,
  validatePassword,
  validateRequired,
} from "@/lib/validation";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, email, password, role } = body;

    // Validation
    const requiredErrors = validateRequired(
      ["name", "email", "password"],
      body
    );
    if (requiredErrors) {
      return errorResponse("Validation failed", 400, requiredErrors);
    }

    if (!validateEmail(email)) {
      return errorResponse("Email tidak valid", 400);
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return errorResponse(passwordError, 400);
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse("Email sudah terdaftar", 400);
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || "user",
    });

    // Generate token
    const token = generateToken(user._id);

    return successResponse(
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      "User berhasil didaftarkan",
      201
    );
  } catch (error) {
    console.error("Register error:", error);
    return errorResponse("Registrasi gagal", 500);
  }
}
