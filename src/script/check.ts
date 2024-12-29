import { PrismaClient } from "@prisma/client";
import ping from "ping";

const client = new PrismaClient();

async function checkStatus() {
  const services = await client.service.findMany();

  services.forEach(async (service) => {
    console.log(`Running ${service.name}`);

    const { type, address, options } = service;

    let status;

    if (type === "ICMP") {
      console.log(`Handling ICMP for ${service.name}`);
      status = await handleICMP(address, options);
    } else if (type === "HTTP") {
      console.log(`Handling HTTP for ${service.name}`);
      status = await handleHTTP(address, options);
    } else {
      console.warn(`Unknown type: ${type}`);
    }

    const uptimeState = await client.uptimeEntry.create({
      data: {
        state: status!.isUp,
        responseTime: status!.responseTime || 0,
        serviceId: service.id,
      },
    });
    console.log(`Created entry ${uptimeState!.id} for service ${service.name}`);
  });
}

async function pingHost(
  host: string,
): Promise<{ isUp: boolean; responseTime?: number }> {
  /**
   * Pings a host and returns whether it's up or down along with the response time.
   *
   * @param host - The hostname or IP address to ping.
   * @returns A promise that resolves with an object containing:
   *          - isUp: True if the host is up, False otherwise.
   *          - responseTime: The response time in milliseconds if up, or undefined if down.
   */
  try {
    const res = await ping.promise.probe(host, {
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
export async function handleICMP(address: string, options: any) {
  return await pingHost(address);
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars
export async function handleHTTP(address: string, options: any) {
  const start = Date.now();
  // if (Object.keys(options).length === 0) options = undefined;
  const res = await fetch(address);
  const secSpent = Date.now() - start; // <---

  return { isUp: res.ok, responseTime: secSpent };
}

checkStatus();
