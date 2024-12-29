import MaintenanceBanner from "@/components/MaintenanceBanner";
import OutageBanner from "@/components/OutageBanner";
import ServiceGroupContainer from "@/components/ServiceGroupContainer";
import ServiceStatus from "@/components/ServiceStatus";
import { GetServerSideProps } from "next";
import Heading from "@/components/ui/heading";
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
    <div className="w-content rounded-xl flex flex-col items-center gap-4 py-8">
      {banner.length > 0 ? (
        banner[0].type == "MAINTENANCE" ? (
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
        )
      ) : (
        <></>
      )}
      <br />
      <br />
      <Heading>Service Groups</Heading>
      {statusData.length > 0 ? (
        statusData.map((item) => (
          <>
            <ServiceGroupContainer title={item.name}>
              {item.services.map((item: Service) => (
                <ServiceStatus
                  key={item.name}
                  service={item.name}
                  status={
                    item.uptimeEntries.length == 0
                      ? "unknown"
                      : item.uptimeEntries[item.uptimeEntries.length - 1]
                            .state == true
                        ? "operational"
                        : "degraded"
                  }
                  history={pad_array(
                    item.uptimeEntries.map((entry) =>
                      entry.state ? "operational" : "degraded",
                    ),
                    90,
                    "unknown",
                  )}
                />
              ))}
            </ServiceGroupContainer>
          </>
        ))
      ) : (
        <></>
      )}
    </div>
  );
}
