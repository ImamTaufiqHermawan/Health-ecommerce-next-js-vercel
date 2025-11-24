/**
 * Request validation utilities
 */

export function validateEmail(email) {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
}

export function validatePassword(password) {
  if (!password || password.length < 6) {
    return "Password minimal 6 karakter";
  }
  return null;
}

export function validateRequired(fields, body) {
  const errors = {};

  fields.forEach((field) => {
    if (
      !body[field] ||
      (typeof body[field] === "string" && body[field].trim() === "")
    ) {
      errors[field] = `${field} wajib diisi`;
    }
  });

  return Object.keys(errors).length > 0 ? errors : null;
}

export function sanitizeInput(input) {
  if (typeof input === "string") {
    return input.trim();
  }
  if (typeof input === "object" && input !== null) {
    const sanitized = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  return input;
}
