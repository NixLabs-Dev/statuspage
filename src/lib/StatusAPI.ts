// Define types for UptimeEntry
export interface UptimeEntry {
  id: number;
  serviceId: number; // Assuming serviceId is a number based on your data structure
  state: boolean;
  responseTime: number;
}

// Define types for Service
export interface Service {
  id: number;
  name: string;
  description: string;
  buttonURL: string;
  address: string;
  type: string;
  options: string; // JSON string, can be parsed if necessary
  serviceGroupId: number; // serviceGroupId is expected to be a string
  uptimeEntries: UptimeEntry[];
}

// Define types for ServiceGroup
export interface ServiceGroup {
  id: number;
  name: string;
  services: Service[]; // services will be an array of Service objects
}

// Define types for BannerItem
export interface BannerItem {
  id: number;
  title: string;
  description: string;
  link: string;
  startTime: Date; // ISO 8601 date-time as a string
  endTime: Date; // ISO 8601 date-time as a string
  type: "MAINTENANCE" | "OUTAGE"; // Assuming type is an enum with specific values
}
