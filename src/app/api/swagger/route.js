/**
 * Swagger Spec API Endpoint
 * GET /api/swagger
 */

import swaggerSpec from "@/lib/swagger";

export async function GET() {
  return Response.json(swaggerSpec);
}
