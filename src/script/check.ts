import { PrismaClient } from "@prisma/client";
import sgMail from "@sendgrid/mail";

import ping from "ping";

const client = new PrismaClient();
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

async function checkStatus() {
  const services = await client.service.findMany();

  for (const service of services) {
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

    // Check and notify if necessary
    await checkAndNotify(service.id);
  }
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
  const res = await fetch(address);
  const secSpent = Date.now() - start;

  return { isUp: res.ok, responseTime: secSpent };
}

/**
 * Check the last two uptime entries for a service and send an email if the
 * last state was up and the current state is down.
 */
async function checkAndNotify(serviceId: number) {
  const lastTwoEntries = await client.uptimeEntry.findMany({
    where: { serviceId },
    orderBy: { id: "desc" },
    take: 2,
  });

  if (
    lastTwoEntries.length === 2 &&
    lastTwoEntries[1].state === true && // Previously up
    lastTwoEntries[0].state === false // Now down
  ) {
    console.log(
      `Service ${serviceId} transitioned from up to down. Sending email...`,
    );
    await sendEmail(serviceId);
  }
}

/**
 * Placeholder for the sendEmail function.
 * Replace this with your actual email sending implementation.
 */
async function sendEmail(serviceId: number) {
  console.log(`Sending email notification for service ID: ${serviceId}`);

  const subscribed = await client.subscribed.findMany();
  const service = await client.service.findFirst({
    where: {
      id: serviceId,
    },
  });

  if (!service) return;

  subscribed.forEach((subscriber) => {
    const msg = {
      to: subscriber.email, // Change to your recipient
      from: "statuspage@em778.notif.nixlabs.dev", // Change to your verified sender
      subject: `Service ${service.name} state has changed from up to down!`,
      text: `Service ${service.name} state has changed from up to down!

      This may be checked here: https://status.nixlabs.dev`,
      html: `Service <strong>${service.name}</strong> state has changed from up to down!

      This may be checked <a href="https://status.nixlabs.dev">here.</a>`,
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log(`Email sent to ${subscriber.email}`);
      })
      .catch((error) => {
        console.error(error);
      });
  });
  // Add your email sending logic here
}

checkStatus();
