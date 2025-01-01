import { Service } from "@/lib/StatusAPI";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const client = new PrismaClient();

function filterServiceFields(services: Service[]) {
  return services.map((service) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { address, type, options, ...filteredService } = service;
    return filteredService;
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const currentTime = new Date();

      // Fetch active banner items
      const activeBannerItems = await client.bannerItem.findMany({
        where: {
          startTime: { lte: currentTime },
          endTime: { gte: currentTime },
        },
      });

      // Fetch service groups with filtered services
      const serviceGroups = await client.serviceGroup.findMany({
        include: {
          services: {
            include: {
              uptimeEntries: {
                take: 120, // Limit to 120 uptimeEntries per service
              },
            },
          },
        },
      });

      const filteredServiceGroups = serviceGroups.map((group) => ({
        ...group,
        services: filterServiceFields(group.services),
      }));

      // Set headers for CORS
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization",
      );

      // Return combined response
      res.status(200).json({
        services: filteredServiceGroups,
        banner: activeBannerItems,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    // Handle unsupported HTTP methods
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
