import { PrismaClient } from "@prisma/client";
import sgMail from "@sendgrid/mail";
import { logInfo } from "../lib/log";

const client = new PrismaClient();
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export async function handle() {
  const services = await client.service.findMany({
    include: {
      uptimeEntries: {
        take: 2,
        orderBy: {
          id: "desc", // Sort by ID in descending order
        },
      },
    },
  });

  const newlyDownServices = services.filter(
    (service) =>
      service.uptimeEntries.length == 2 &&
      service.uptimeEntries[1].state === true &&
      service.uptimeEntries[0].state === false,
  );

  const serviceNames = newlyDownServices.map((service) => service.name);

  if (serviceNames.length > 0) {
    const subscribers = await client.subscribed.findMany();
    subscribers.forEach((subscriber) => {
      logInfo(
        `Sending email to ${subscriber.email} about service outage with ${serviceNames.join(", ")}`,
      );

      sendMail(
        `${serviceNames.join(", ")} are down`,
        `Dear ${subscriber.email},
The NixLabs Statuspage has noticed services go down, these services are ${serviceNames.join(", ")}.

~ The NixLabs Crew`,
        subscriber.email,
      );
    });
  } else {
    return;
  }
}

function sendMail(subject: string, body: string, to: string) {
  const msg = {
    to: to, // Change to your recipient
    from: "statuspage@em778.notif.nixlabs.dev", // Change to your verified sender
    subject: subject,
    text: body,
  };
  sgMail
    .send(msg)
    .then(() => {
      logInfo(`Email sent to ${to}`);
    })
    .catch((error) => {
      console.error(error);
    });
}
