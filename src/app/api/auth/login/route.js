/**
 * Auth API - Login
 * POST /api/auth/login
 */

import connectDB from "@/lib/database";
import User from "@/models/User";
import { generateToken } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return errorResponse("Email dan password wajib diisi", 400);
    }

    // Find user (include password for comparison)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return errorResponse("Email atau password salah", 401);
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return errorResponse("Email atau password salah", 401);
    }

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
      "Login berhasil"
    );
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse("Login gagal", 500);
  }
}
