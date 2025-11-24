/**
 * Auth API - Get Profile
 * GET /api/auth/profile
 * PUT /api/auth/profile
 */

import connectDB from "@/lib/database";
import User from "@/models/User";
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

    const user = await User.findById(authResult.userId);

    if (!user) {
      return errorResponse("User tidak ditemukan", 404);
    }

    return successResponse({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      profilePhoto: user.profilePhoto,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return errorResponse("Gagal mengambil profil", 500);
  }
}

export async function PUT(request) {
  try {
    await connectDB();

    const authResult = await verifyAuth(request);
    if (authResult.error) {
      return unauthorizedResponse(authResult.error);
    }

    const user = await User.findById(authResult.userId);

    if (!user) {
      return errorResponse("User tidak ditemukan", 404);
    }

    const body = await request.json();

    // Update allowed fields
    if (body.name) user.name = body.name;
    if (body.phone) user.phone = body.phone;
    if (body.address) user.address = body.address;
    if (body.password) user.password = body.password; // Will be hashed

    await user.save();

    return successResponse(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        profilePhoto: user.profilePhoto,
      },
      "Profil berhasil diupdate"
    );
  } catch (error) {
    console.error("Update profile error:", error);
    return errorResponse("Gagal mengupdate profil", 500);
  }
}
