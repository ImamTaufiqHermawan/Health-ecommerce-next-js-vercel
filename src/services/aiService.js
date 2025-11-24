/**
 * AI Service - Google Gemini Integration for Next.js
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import Product from "@/models/Product";

class AIService {
  constructor() {
    this.apiKey = process.env.GOOGLE_AI_API_KEY;
    this.modelName = "gemini-2.0-flash-exp";
    this.cache = new Map();
    this.CACHE_TTL = 60 * 60 * 1000; // 1 hour

    if (!this.apiKey) {
      console.warn("GOOGLE_AI_API_KEY not set. AI features will not work.");
      this.genAI = null;
    } else {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
    }
  }

  async getHealthRecommendation(userQuestion) {
    if (!this.genAI) {
      return {
        success: false,
        message: "AI service is not configured.",
        fallback: "Please contact support.",
      };
    }

    try {
      const cacheKey = userQuestion.toLowerCase().trim();
      const cached = this.cache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
        return { ...cached.data, cached: true };
      }

      const products = await Product.find({ isActive: true })
        .select("name category price description manufacturer")
        .limit(30)
        .lean();

      if (products.length === 0) {
        return {
          success: false,
          message: "No products available in database",
        };
      }

      const productList = products
        .map(
          (p) =>
            `- ${p.name} (${p.category}): ${
              p.description || "Produk kesehatan"
            }. Harga: Rp ${p.price.toLocaleString("id-ID")}. Dari: ${
              p.manufacturer
            }`
        )
        .join("\n");

      const prompt = `Kamu adalah asisten apotek digital bernama "HealthBot" untuk Health E-Commerce.

PRODUK TERSEDIA:
${productList}

PERTANYAAN USER: "${userQuestion}"

INSTRUKSI:
1. Jawab dalam Bahasa Indonesia yang ramah
2. Rekomendasikan maksimal 3 produk yang relevan
3. Jelaskan KENAPA produk cocok
4. Sebutkan nama produk PERSIS seperti di list
5. Tambahkan disclaimer konsultasi dokter
6. Format natural (bukan bullet points!)

JAWABAN:`;

      const model = this.genAI.getGenerativeModel({ model: this.modelName });
      const sdkResult = await model.generateContent(prompt);
      const response = await sdkResult.response;
      const aiAnswer = response.text();

      const recommendations = this.extractRecommendations(aiAnswer, products);

      const result = {
        success: true,
        answer: aiAnswer,
        recommendedProducts: recommendations,
        totalAvailable: products.length,
        timestamp: new Date(),
      };

      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now(),
      });

      return result;
    } catch (error) {
      console.error("Gemini AI Error:", error.message);

      return {
        success: false,
        message: "AI service temporarily unavailable",
        fallback: "Silakan browse produk kami atau hubungi customer service.",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      };
    }
  }

  extractRecommendations(aiText, products) {
    const recommendations = [];

    products.forEach((product) => {
      const mentioned = aiText
        .toLowerCase()
        .includes(product.name.toLowerCase());

      if (mentioned) {
        recommendations.push({
          id: product._id.toString(),
          name: product.name,
          category: product.category,
          price: product.price,
          description: product.description,
        });
      }
    });

    return recommendations.slice(0, 3);
  }

  clearCache() {
    this.cache.clear();
    console.log("AI cache cleared");
  }
}

export default new AIService();
