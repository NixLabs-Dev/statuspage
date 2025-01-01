import { Service } from "@/lib/StatusAPI";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const client = new PrismaClient();

function filterServiceFields(services: Service[]) {
  return services.map((service) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { address, type, options, ...filteredService } = service; // Exclude unwanted fields
    return filteredService; // Return the filtered service object
  });
}

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
              uptimeEntries: {
                take: 120, // Limit to 120 uptimeEntries per service
              },
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
      const filteredServiceGroups = serviceGroups.map((group) => {
        return {
          ...group, // Retain the serviceGroup properties
          services: filterServiceFields(group.services), // Apply filtering to the services array within the group
        };
      });

      // Return the active items items as JSON
      return res.status(200).json(filteredServiceGroups);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch group items." });
    }
  } else {
    // Handle unsupported HTTP methods
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
