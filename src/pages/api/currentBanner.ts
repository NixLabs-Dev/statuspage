import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const client = new PrismaClient();

// The handler function for GET requests to /api/banner
export async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const currentTime = new Date();

      // Fetch active banner items based on the current time
      const activeBannerItems = await client.bannerItem.findMany({
        where: {
          startTime: { lte: currentTime },
          endTime: { gte: currentTime },
        },
      });

      // Set the CORS headers
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization",
      );

      // Return the result as a JSON response
      res.status(200).json(activeBannerItems);
    } catch (error) {
      console.error(error);

      // Handle any errors
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    // If method is not GET, return a 405 Method Not Allowed
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

export default handler;
