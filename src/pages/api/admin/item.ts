import handleAuth from "@/lib/handleAuth";
import { PrismaClient, ServiceType } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { z, ZodError } from "zod";

const client = new PrismaClient();

const schema = z.object({
  name: z.string().nonempty("Name is required"),
  description: z.string().nonempty("Description is required"),
  buttonURL: z.string().url("Invalid URL format"),
  address: z.string().nonempty("Address is required"),
  type: z.nativeEnum(ServiceType),
  options: z.any(), // Use `.any()` for flexible structure; customize based on expected shape if needed
  serviceGroup: z
    .string()
    .regex(/^\d+$/, "Service group must be a valid number")
    .transform((val) => parseInt(val, 10)) // Transform string to integer
    .refine((val) => val >= 0, {
      message: "Service group must be a non-negative number",
    }),
});

// The handler function for GET requests to /api/banner
export async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!req.headers.authorization)
    return res.status(400).json({
      error: "Please pass an authorization header!",
    });
  const name = req.headers.authorization?.split(":")[0] || "";
  const secret = req.headers.authorization?.split(":")[1] || "";

  const isAuthorized = await handleAuth(secret, name, "Statuspage.CreateItem");

  if (!isAuthorized)
    res.status(401).json({ message: "You are not authorized!" });

  if (req.method == "GET") {
    try {
      const services = await client.service.findMany();

      res.status(200).json(
        services.map((service) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { address, type, options, ...filteredService } = service; // Exclude unwanted fields
          return filteredService; // Return the filtered service object
        }),
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: error.errors
            .map((e) => `${e.path.join(".")} is ${e.message}`)
            .join("\n"),
        });
      } else {
        res.status(500).json(error.message);
      }
    }
  }
  if (req.method === "POST") {
    try {
      const data = schema.parse(req.body);

      const item = await client.service.create({
        data: {
          name: data.name,
          description: data.description,
          buttonURL: data.buttonURL,
          address: data.address,
          type: data.type,
          options: JSON.stringify(data.options || {}),
          serviceGroupId: data.serviceGroup,
        },
      });

      res.status(200).json({
        message: "Successfully created status item" + item.name,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: error.errors
            .map((e) => `${e.path.join(".")} is ${e.message}`)
            .join("\n"),
        });
      } else {
        res.status(500).json(error.message);
      }
    }
  } else {
    // If method is not GET, return a 405 Method Not Allowed
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

export default handler;
