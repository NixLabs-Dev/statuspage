import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function cleanupUptimeEntries() {
  try {
    // Fetch all services to iterate through
    const services = await prisma.service.findMany({
      select: {
        id: true,
        uptimeEntries: {
          select: { id: true },
          orderBy: { id: "desc" }, // Oldest entries first
        },
      },
    });

    for (const service of services) {
      const { id: serviceId, uptimeEntries } = service;

      // Check if we have more than 200 entries
      if (uptimeEntries.length > 200) {
        // Calculate the number of entries to delete
        const excessEntries = uptimeEntries.length - 200;

        // Get the IDs of the oldest entries to delete
        const entriesToDelete = uptimeEntries
          .slice(0, excessEntries) // Select the excess oldest entries
          .map((entry) => entry.id);

        // Delete the excess entries
        await prisma.uptimeEntry.deleteMany({
          where: {
            id: { in: entriesToDelete },
          },
        });

        console.log(
          `Cleaned up ${excessEntries} UptimeEntry items for Service ID ${serviceId}`,
        );
      }
    }

    console.log("Database cleanup completed.");
  } catch (error) {
    console.error("Error during database cleanup:", error);
  } finally {
    await prisma.$disconnect();
  }
}
