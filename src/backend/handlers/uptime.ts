import { PrismaClient } from "@prisma/client";
import ping from "ping";
import { logInfo, logWarn } from "../lib/log";

const client = new PrismaClient();

export async function handle() {
  const services = await client.service.findMany();

  for (const service of services) {
    const { type, address, options } = service;

    let status;

    if (type === "ICMP") {
      status = await checkICMP(address, options);
    } else if (type === "HTTP") {
      status = await checkHTTP(address, options);
    } else {
      logWarn(`Unknown type: ${type}`);
      continue;
    }

    const uptimeState = await client.uptimeEntry.create({
      data: {
        state: status!.isUp,
        responseTime: status!.responseTime || 0,
        serviceId: service.id,
      },
    });
    logInfo(
      `Created entry ${uptimeState!.id} for service ${service.name} with type ${type}`,
    );
  }
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars
export async function checkICMP(address: string, options: any) {
  try {
    const res = await ping.promise.probe(address, {
      timeout: 1,
      extra: ["-c", "1"],
    }); // Single packet
    return {
      isUp: res.alive,
      responseTime: res.alive ? (res.time as number) : undefined,
    };
  } catch (error) {
    console.error(`Error pinging host: ${error}`);
    return { isUp: false };
  }
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars
export async function checkHTTP(address: string, options: any) {
  const start = Date.now();
  const res = await fetch(address);
  const secSpent = Date.now() - start;

  return { isUp: res.ok, responseTime: secSpent };
}
