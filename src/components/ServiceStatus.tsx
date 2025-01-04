import { pad_array } from "@/lib/utils";
import { UptimeEntry } from "@prisma/client";
import React, { useState, useEffect } from "react";

type ServiceStatusProps = {
  service: string;
  description: string;
  uptime?: UptimeEntry[]; // Past statuses
};

type uptimeTypes = "operational" | "down" | "degraded";

const statusColors: Record<string, string> = {
  Operational: "text-green-500",
  Degraded: "text-yellow-500",
  Down: "text-red-500",
  Unknown: "text-neutral-500 hover:text-neutral-300",
};

const statusBackgrounds: Record<string, string> = {
  operational: "bg-green-500 hover:bg-green-300",
  degraded: "bg-yellow-500 hover:bg-yellow-300",
  down: "bg-red-500 hover:bg-red-300",
  unknown: "bg-neutral-500 hover:bg-neutral-300",
};

const ServiceStatus: React.FC<ServiceStatusProps> = ({
  service,
  uptime = [],
  description,
}) => {
  const history = pad_array(
    uptime.map((entry) => {
      return entry.state ? "operational" : "down";
    }),
    120,
    "unknown",
  );

  const [visibleHistory, setVisibleHistory] = useState(
    history.slice(0, 20), // Default to small screen size on server render
  );

  useEffect(() => {
    const updateVisibleHistory = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setVisibleHistory(history.slice(history.length - 120, 120)); // Large screens (lg)
      } else if (width >= 768) {
        setVisibleHistory(history.slice(history.length - 90, 120)); // Medium screens (md)
      } else if (width >= 500) {
        setVisibleHistory(history.slice(history.length - 60, 120)); // Small screens (sm and below)
      } else {
        setVisibleHistory(history.slice(history.length - 30, 120)); // Smallest screens
      }
    };

    // Initial update
    updateVisibleHistory();

    // Add resize event listener
    window.addEventListener("resize", updateVisibleHistory);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", updateVisibleHistory);
  }, [history]);

  const minutes = visibleHistory.length; // Calculate the time span

  const getStatus = (
    prev: uptimeTypes,
    current: uptimeTypes,
    next: uptimeTypes,
  ) => {
    if (prev === undefined && current === "down") return "down";
    if (prev === "operational" && current === "down" && next === "down")
      return "degraded";
    if (prev === "operational" && current === "down" && next === "operational")
      return "degraded";
    if (prev === "down" && current === "down") return "down";
    if (prev === "down" && current === "operational") return "degraded";
    if (prev === "degraded" && current === "operational") return "operational";
    return current; // Default to the current status if no rule matches
  };

  return (
    <div className="flex flex-col space-y-4 p-4 border border-neutral-800 rounded-lg">
      {/* Service name and status */}
      <div className="flex items-center justify-between">
        <span className="flex flex-row items-center gap-10">
          <span className="text-lg font-bold">{service}</span>
          <span className="text-neutral-200 hidden md:block">
            {description}
          </span>
        </span>
        <span
          className={`text-sm font-semibold ${
            statusColors[
              history
                .slice(-10)
                .every((state) => state === "down" || state === "degraded")
                ? "Down"
                : history
                      .slice(-5)
                      .every(
                        (state) => state === "down" || state === "degraded",
                      )
                  ? "Degraded"
                  : "Operational"
            ]
          }`}
        >
          {history
            .slice(-10)
            .every((state) => state === "down" || state === "degraded")
            ? "Down"
            : history
                  .slice(-5)
                  .every((state) => state === "down" || state === "degraded")
              ? "Degraded"
              : "Operational"}
        </span>
      </div>

      {/* Status history bars */}
      <div className="flex space-x-1">
        {history.map((current, index) => {
          const prev = history[index - 1];
          const next = history[index + 1];
          const status = getStatus(prev, current, next);

          return (
            <div
              key={index}
              className={`w-2 h-6 rounded-sm transition-colors duration-200 ${statusBackgrounds[status]}`}
            />
          );
        })}
      </div>

      {/* Breakline with text */}
      <div className="relative flex items-center my-2">
        <div className="flex-grow border-t border-neutral-700"></div>
        <span className="px-3 text-sm text-neutral-500">
          {minutes} minutes of status
        </span>
        <div className="flex-grow border-t border-neutral-700"></div>
      </div>
    </div>
  );
};

export default ServiceStatus;
