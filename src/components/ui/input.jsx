import React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";
