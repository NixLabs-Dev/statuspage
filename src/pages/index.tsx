import MaintenanceBanner from "@/components/MaintenanceBanner";
import OutageBanner from "@/components/OutageBanner";
import ServiceGroupContainer from "@/components/ServiceGroupContainer";
import ServiceStatus from "@/components/ServiceStatus";
import { GetServerSideProps } from "next";
// import Heading from "@/components/ui/heading";
import { pad_array } from "@/lib/utils";
import { ServiceGroup, Service, BannerItem } from "@/lib/StatusAPI";
import { PrismaClient } from "@prisma/client";

export const getServerSideProps = (async () => {
  const client = new PrismaClient();

  const currentTime = new Date();

  // Fetch active banner items based on the current time
  const banner: BannerItem[] = (await client.bannerItem.findMany({
    where: {
      startTime: { lte: currentTime },
      endTime: { gte: currentTime },
    },
  })) as BannerItem[];

  const groups: ServiceGroup[] = (await client.serviceGroup.findMany({
    include: {
      services: {
        include: {
          uptimeEntries: true,
        },
      },
    },
  })) as ServiceGroup[];
  // Pass data to the page via props
  return { props: { banner, groups } };
}) satisfies GetServerSideProps<{
  groups: ServiceGroup[];
  banner: BannerItem[];
}>;

export default function Home({
  banner,
  groups: statusData,
}: {
  banner: BannerItem[];
  groups: ServiceGroup[];
}) {
  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {banner.length > 0 && (
        <div className="w-full">
          {banner[0].type == "MAINTENANCE" ? (
            <MaintenanceBanner
              key={banner[0].title}
              title={banner[0].title}
              body={banner[0].description}
              startTime={banner[0].startTime}
              endTime={banner[0].endTime}
            />
          ) : (
            <OutageBanner
              key={banner[0].title}
              title={banner[0].title}
              body={banner[0].description}
              startTime={banner[0].startTime}
              endTime={banner[0].endTime}
            />
          )}
        </div>
      )}
      {/* <Heading className="mb-4">Service Groups</Heading> */}
      {statusData.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {statusData.map((group) => (
            <ServiceGroupContainer
              key={group.name}
              title={group.name}
              description={group.description}
            >
              {group.services.map((service: Service) => (
                <ServiceStatus
                  key={service.name}
                  service={service.name}
                  status={
                    service.uptimeEntries.length === 0
                      ? "unknown"
                      : service.uptimeEntries[service.uptimeEntries.length - 1]
                            .state
                        ? "operational"
                        : "degraded"
                  }
                  history={pad_array(
                    service.uptimeEntries.map((entry) => {
                      return entry.state ? "operational" : "down";
                    }),
                    200,
                    "unknown",
                  )}
                />
              ))}
            </ServiceGroupContainer>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No services available.</p>
      )}
    </div>
  );
}
