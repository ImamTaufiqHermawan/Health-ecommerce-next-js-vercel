/**
 * Admin Seed API - ONE TIME USE ONLY
 * POST /api/admin/seed
 *
 * IMPORTANT: Remove this file after seeding production database!
 */

import connectDB from "@/lib/database";
import Product from "@/models/Product";
import { successResponse, errorResponse } from "@/lib/apiResponse";

const SEED_KEY = process.env.SEED_SECRET_KEY || "your-secret-seed-key-2024";

export async function POST(request) {
  try {
    // Security check
    const body = await request.json();
    if (body.secretKey !== SEED_KEY) {
      return errorResponse("Unauthorized", 401);
    }

    await connectDB();

    // Check if already seeded
    const existingCount = await Product.countDocuments();
    if (existingCount > 0) {
      return errorResponse(
        `Database already has ${existingCount} products. Delete them first if you want to reseed.`,
        400
      );
    }

    // Seed products
    const products = [
      {
        name: "Vitamin C 1000mg",
        category: "Vitamin",
        price: 85000,
        stock: 100,
        description: "Vitamin C untuk meningkatkan daya tahan tubuh",
        manufacturer: "Sido Muncul",
        image:
          "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500",
        isActive: true,
      },
      {
        name: "Vitamin D3 5000 IU",
        category: "Vitamin",
        price: 120000,
        stock: 50,
        description: "Vitamin D3 untuk kesehatan tulang dan imunitas",
        manufacturer: "Kalbe Farma",
        image:
          "https://images.unsplash.com/photo-1550572017-4ec3c6e3f8f1?w=500",
        isActive: true,
      },
      {
        name: "Omega-3 Fish Oil",
        category: "Suplemen",
        price: 250000,
        stock: 75,
        description: "Minyak ikan Omega-3 untuk kesehatan jantung",
        manufacturer: "Blackmores",
        image:
          "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=500",
        isActive: true,
      },
      {
        name: "Multivitamin Complete",
        category: "Vitamin",
        price: 150000,
        stock: 80,
        description: "Multivitamin lengkap untuk kesehatan optimal",
        manufacturer: "Nature Made",
        image:
          "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500",
        isActive: true,
      },
      {
        name: "Probiotics 10 Billion CFU",
        category: "Suplemen",
        price: 180000,
        stock: 60,
        description: "Probiotik untuk kesehatan pencernaan",
        manufacturer: "Garden of Life",
        image:
          "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500",
        isActive: true,
      },
      {
        name: "Magnesium Complex",
        category: "Mineral",
        price: 95000,
        stock: 90,
        description: "Magnesium untuk otot dan saraf",
        manufacturer: "Now Foods",
        image:
          "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500",
        isActive: true,
      },
      {
        name: "Zinc 50mg",
        category: "Mineral",
        price: 75000,
        stock: 100,
        description: "Zinc untuk daya tahan tubuh",
        manufacturer: "Solgar",
        image:
          "https://images.unsplash.com/photo-1550572017-4ec3c6e3f8f1?w=500",
        isActive: true,
      },
      {
        name: "Collagen Peptides",
        category: "Suplemen",
        price: 320000,
        stock: 45,
        description: "Kolagen untuk kesehatan kulit",
        manufacturer: "Vital Proteins",
        image:
          "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=500",
        isActive: true,
      },
      {
        name: "Iron Complex",
        category: "Mineral",
        price: 85000,
        stock: 70,
        description: "Zat besi untuk mencegah anemia",
        manufacturer: "Vitabiotics",
        image:
          "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500",
        isActive: true,
      },
      {
        name: "Calcium + Vitamin D",
        category: "Mineral",
        price: 110000,
        stock: 85,
        description: "Kalsium dan vitamin D untuk tulang kuat",
        manufacturer: "Caltrate",
        image:
          "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500",
        isActive: true,
      },
      {
        name: "B-Complex Vitamins",
        category: "Vitamin",
        price: 90000,
        stock: 95,
        description: "Vitamin B kompleks untuk energi",
        manufacturer: "Nature's Bounty",
        image:
          "https://images.unsplash.com/photo-1550572017-4ec3c6e3f8f1?w=500",
        isActive: true,
      },
      {
        name: "Echinacea Extract",
        category: "Herbal",
        price: 125000,
        stock: 55,
        description: "Ekstrak echinacea untuk sistem imun",
        manufacturer: "Nature's Way",
        image:
          "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=500",
        isActive: true,
      },
      {
        name: "Protein Powder Whey",
        category: "Suplemen",
        price: 450000,
        stock: 40,
        description: "Whey protein untuk pembentukan otot",
        manufacturer: "Optimum Nutrition",
        image:
          "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500",
        isActive: true,
      },
      {
        name: "Glucosamine Chondroitin",
        category: "Suplemen",
        price: 275000,
        stock: 50,
        description: "Untuk kesehatan sendi dan tulang rawan",
        manufacturer: "Schiff",
        image:
          "https://images.unsplash.com/photo-1550572017-4ec3c6e3f8f1?w=500",
        isActive: true,
      },
      {
        name: "Vitamin K2 + D3",
        category: "Vitamin",
        price: 165000,
        stock: 60,
        description: "Kombinasi vitamin K2 dan D3 untuk tulang",
        manufacturer: "Sports Research",
        image:
          "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500",
        isActive: true,
      },
      {
        name: "Biotin 10000mcg",
        category: "Vitamin",
        price: 110000,
        stock: 75,
        description: "Biotin untuk kesehatan rambut dan kuku",
        manufacturer: "Natrol",
        image:
          "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500",
        isActive: true,
      },
      {
        name: "CoQ10 200mg",
        category: "Suplemen",
        price: 295000,
        stock: 45,
        description: "Koenzim Q10 untuk energi sel",
        manufacturer: "Qunol",
        image:
          "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=500",
        isActive: true,
      },
      {
        name: "Spirulina Tablets",
        category: "Suplemen",
        price: 185000,
        stock: 65,
        description: "Spirulina superfood untuk nutrisi lengkap",
        manufacturer: "Hawaiian Spirulina",
        image:
          "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500",
        isActive: true,
      },
      {
        name: "Turmeric Curcumin",
        category: "Herbal",
        price: 160000,
        stock: 70,
        description: "Kurkumin dari kunyit untuk anti-inflamasi",
        manufacturer: "Gaia Herbs",
        image:
          "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=500",
        isActive: true,
      },
      {
        name: "Apple Cider Vinegar",
        category: "Suplemen",
        price: 135000,
        stock: 80,
        description: "Cuka apel untuk metabolisme",
        manufacturer: "Bragg",
        image:
          "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=500",
        isActive: true,
      },
      {
        name: "Ashwagandha Extract",
        category: "Herbal",
        price: 215000,
        stock: 55,
        description: "Ashwagandha untuk mengurangi stress",
        manufacturer: "Himalaya",
        image:
          "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500",
        isActive: true,
      },
    ];

    const result = await Product.insertMany(products);

    return successResponse({
      message: "Database seeded successfully",
      productsCreated: result.length,
      products: result,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return errorResponse(error.message, 500);
  }
}
