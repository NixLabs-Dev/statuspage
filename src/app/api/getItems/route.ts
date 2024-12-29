import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const client = new PrismaClient();

// To handle a GET request to /api
export async function GET() {
  // Do whatever you want
  const serviceGroups = await client.serviceGroup.findMany({
    include: {
      services: {
        include: {
          uptimeEntries: true,
        },
      },
    },
  });
  const response = NextResponse.json(serviceGroups, { status: 200 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );

  return response;
}
