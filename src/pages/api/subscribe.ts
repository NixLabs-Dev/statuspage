import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const client = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const { email } = req.body;

      if (!email || typeof email !== "string" || !validateEmail(email)) {
        return res.status(400).json({ error: "Invalid email address." });
      }

      // Check if the email is already subscribed
      const existingSubscriber = await client.subscribed.findUnique({
        where: { email },
      });

      if (existingSubscriber) {
        return res.status(400).json({ error: "User already subscribed" });
      }

      const subscriber = await client.subscribed.create({ data: { email } });

      res.status(201).json(subscriber);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

// Helper function to validate email
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email validation regex
  return emailRegex.test(email);
}
