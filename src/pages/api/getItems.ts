import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const client = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      // Fetch active banner items
      const serviceGroups = await client.serviceGroup.findMany({
        include: {
          services: {
            include: {
              uptimeEntries: true,
            },
          },
        },
      });

      // Set headers for CORS
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization",
      );

      // Return the active banner items as JSON
      return res.status(200).json(serviceGroups);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch banner items." });
    }
  } else {
    // Handle unsupported HTTP methods
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
