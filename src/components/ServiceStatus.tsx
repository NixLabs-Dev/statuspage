import React from "react";

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
  return (
    <div className="flex flex-col space-y-2 p-4 border border-neutral-800 rounded-lg">
      {/* Service name and status */}
      <div className="flex items-center justify-between">
        <span className="text-lg font-medium">{service}</span>
        <span className={`text-sm font-semibold ${statusColors[status]}`}>
          {status}
        </span>
      </div>

      {/* Status history bars */}
      <div className="flex space-x-1">
        {history.map((item, index) => (
          <div
            key={index}
            className={`w-2 h-6 rounded-sm transition-colors duration-200 ${statusBackgrounds[item]}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ServiceStatus;
