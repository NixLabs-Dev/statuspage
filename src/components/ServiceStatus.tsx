import React, { useState, useEffect } from "react";

type ServiceStatusProps = {
  service: string;
  status: "operational" | "degraded" | "down" | "unknown";
  history?: ("operational" | "degraded" | "down" | "unknown")[]; // Past statuses
};

const statusColors: Record<string, string> = {
  operational: "text-green-500",
  degraded: "text-yellow-500",
  down: "text-red-500",
  unknown: "text-neutral-500 hover:text-neutral-300",
};

const statusBackgrounds: Record<string, string> = {
  operational: "bg-green-500 hover:bg-green-300",
  degraded: "bg-yellow-500 hover:bg-yellow-300",
  down: "bg-red-500 hover:bg-red-300",
  unknown: "bg-neutral-500 hover:bg-neutral-300",
};

const ServiceStatus: React.FC<ServiceStatusProps> = ({
  service,
  status,
  history = [],
}) => {
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

  return (
    <div className="flex flex-col space-y-4 p-4 border border-neutral-800 rounded-lg">
      {/* Service name and status */}
      <div className="flex items-center justify-between">
        <span className="text-lg font-medium">{service}</span>
        <span className={`text-sm font-semibold ${statusColors[status]}`}>
          {status}
        </span>
      </div>

      {/* Status history bars */}
      <div className="flex space-x-1">
        {visibleHistory.map((item, index) => (
          <div
            key={index}
            className={`w-2 h-6 rounded-sm transition-colors duration-200 ${statusBackgrounds[item]}`}
          />
        ))}
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
