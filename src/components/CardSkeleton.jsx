"use client";
import React from "react";

const CardSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="p-4 border rounded-lg shadow-sm bg-white space-y-3 animate-pulse"
        >
          <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
          <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
          <div className="h-3 w-1/3 bg-gray-200 rounded"></div>
          <div className="h-3 w-full bg-gray-200 rounded"></div>
          <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
};

export default CardSkeleton;
