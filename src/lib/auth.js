/**
 * JWT Authentication Middleware for Next.js API Routes
 */

import jwt from "jsonwebtoken";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

/**
 * Verify JWT token and attach user to request
 */
export async function verifyAuth(request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { error: "No token provided", status: 401 };
    }

    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Get user from database
    const user = await User.findById(decoded.userId).select("-password");

    if (!user || !user.isActive) {
      return { error: "User not found or inactive", status: 401 };
    }

    return { user, userId: decoded.userId };
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return { error: "Invalid token", status: 401 };
    }
    if (error.name === "TokenExpiredError") {
      return { error: "Token expired", status: 401 };
    }
    return { error: "Authentication failed", status: 401 };
  }
}

/**
 * Generate JWT token
 */
export function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  });
}

/**
 * Check if user is admin
 */
export async function verifyAdmin(request) {
  const authResult = await verifyAuth(request);

  if (authResult.error) {
    return authResult;
  }

  if (authResult.user.role !== "admin") {
    return { error: "Admin access required", status: 403 };
  }

  return authResult;
}
