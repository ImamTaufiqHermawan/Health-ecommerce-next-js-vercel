/**
 * Swagger Configuration for Next.js API Documentation
 */

const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Health E-Commerce API",
      version: "1.0.0",
      description:
        "Complete Health E-Commerce API with AI, Payment, and External Integrations",
      contact: {
        name: "API Support",
        email: "support@healthcommerce.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
      {
        url: "https://yourdomain.vercel.app",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: "Auth",
        description: "Authentication endpoints",
      },
      {
        name: "Products",
        description: "Product management",
      },
      {
        name: "Cart",
        description: "Shopping cart operations",
      },
      {
        name: "Orders",
        description: "Order management",
      },
      {
        name: "External",
        description: "External API integrations (AI, Payment)",
      },
      {
        name: "Health",
        description: "Health check endpoint",
      },
    ],
  },
  apis: ["./src/app/api/**/*.js"], // Path to API routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
