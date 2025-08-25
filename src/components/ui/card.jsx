import React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }) {
  return (
    <div className={cn("rounded-2xl border bg-white shadow-md p-4 ", className)} {...props} />
  );
}

export function CardContent({ className, ...props }) {
  return <div className={cn("space-y-2 mx-auto justify-center flex-col items-center flex ", className)} {...props} />;
}
