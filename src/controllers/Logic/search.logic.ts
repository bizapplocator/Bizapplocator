import type { Request, Response } from "express"; // Or your framework's request/response types
import type { PrismaClient } from "../../generated/prisma/client.ts";
import { prisma } from "../../lib/db.ts";
import redisClient from "../../redis.ts";
export class ProductSearchEngine {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Enhanced search: Joins Products with their Business Owner details
   */
  // Assuming your VerificationUpdate model has a status field
  async searchWithBusiness(query: string, skip = 0, take = 10) {
    return await this.prisma.product.findMany({
      where: {
        AND: [
          // 1. Existing Search Logic
          {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
              {
                user: {
                  businessOwnerAuth: {
                    businessName: { contains: query, mode: "insensitive" },
                  },
                },
              },
            ],
          },
          // 2. Strict Filter: Only return verified businesses
          {
            user: {
              businessOwnerAuth: {
                verification: {
                  status: "APPROVED", // Adjust based on your actual VerificationUpdate field
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        basePrice: true,
        media: {
          select: { url: true, altText: true, rank: true },
          orderBy: { rank: "asc" },
        },
        user: {
          select: {
            businessOwnerAuth: {
              select: {
                businessName: true,
                phoneNumber: true,
                emailAddress: true,
                businessAddress: true,
              },
            },
          },
        },
      },
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Helper to ensure exactly 3 images are returned
   */
  getDisplayImages(productMedia: any[], fallbackUrl = "/placeholder.png") {
    const images = [...productMedia].sort((a, b) => a.rank - b.rank);
    // Fill up to 3
    return Array.from(
      { length: 3 },
      (_, i) => images[i] || { url: fallbackUrl, altText: "Placeholder" },
    );
  }

  handleProductSearch = async (req: Request, res: Response) => {
    try {
      // 1. Extract query parameters
      const { q, page = "1", limit = "10" } = req.query;

      if (!q || typeof q !== "string") {
        return res.status(400).json({ error: 'Search query "q" is required.' });
      }
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // 2. Perform the search using our class
      const products = await this.searchWithCache(q, skip, limitNum);

      // 3. Process the results for the frontend (Map media to 3 images)
      const formattedProducts = products.map((product) => {
        // Safely extract the business details
        const business = product.user?.businessOwnerAuth;

        return {
          id: product.id,
          name: product.name,
          price: product.basePrice,
          // Add the new contact fields you requested
          business: {
            name: business?.businessName || "Anonymous Seller",
            phoneNumber: business?.phoneNumber || "N/A",
            email: business?.emailAddress || "N/A",
            address: business?.businessAddress || "Not provided",
          },
          // Using the helper from our class
          displayImages: this.getDisplayImages(product.media),
        };
      });
      // 4. Return the response
      return res.status(200).json({
        success: true,
        count: formattedProducts.length,
        data: formattedProducts,
      });
    } catch (error) {
      console.error("Search Engine Error:", error);
      return res
        .status(500)
        .json({ error: "Internal server error while searching." });
    }
  };

  async searchWithCache(query: string, page = 1, limit = 10) {
    const cacheKey = `search:${query.toLowerCase()}:p${page}:l${limit}`;

    // 1. Check if the result exists in Redis
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Cache Hit: Returning search results from Redis");
      return JSON.parse(cachedData);
    }

    // 2. Cache Miss: Query the Database
    console.log("Cache Miss: Querying Database...");
    const skip = (page - 1) * limit;
    const products = await this.searchWithBusiness(query, skip, limit);

    // 3. Store result in Redis (e.g., for 5 minutes)
    // We store the stringified version
    await redisClient.set(cacheKey, JSON.stringify(products), { EX: 300 });

    return products;
  }
}
