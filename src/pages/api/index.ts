import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return res.status(200).json({
    message: "NixLabs Statuspage API",
    version: "v2",
    handlers: ["/getItems", "/currentBanner"],
  });
}
