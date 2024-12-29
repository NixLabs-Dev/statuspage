"use client";
import React, { useState } from "react";
type MaintenanceBannerProps = {
  title: string;
  body: string;
  startTime: Date;
  endTime: Date;
};

const MaintenanceBanner: React.FC<MaintenanceBannerProps> = ({
  title,
  body,
  startTime,
  endTime,
}) => {
  const [isShown, setIsShown] = useState(true);
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short", // This is correct
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // For AM/PM format
    };

    return date.toLocaleString("en-US", options).replace(",", "");
  };

  return (
    <div
      className={`bg-red-600 text-white p-4 flex w-3/4 items-center justify-between space-x-6 shadow-md rounded-xl ${isShown ? "block" : "hidden "}`}
    >
      {/* Icon and Message */}
      <div className="flex items-center space-x-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 1010 10A10 10 0 0012 2z"
          />
        </svg>
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-sm">{body}</p>
          <p className="text-sm font-medium">
            <span className="font-bold">{formatDate(startTime)}</span> to{" "}
            <span className="font-bold">{formatDate(endTime)}</span>
          </p>
        </div>
      </div>

      {/* Dismiss Button */}
      <button
        className="text-yellow-100 hover:text-white font-medium"
        onClick={() => {
          // Optional: Add functionality to hide the banner
          console.log("Maintenance banner dismissed.");
          setIsShown(false);
        }}
      >
        Dismiss
      </button>
    </div>
  );
};

export default MaintenanceBanner;
