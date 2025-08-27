import React from "react";
import { cn } from "@/lib/utils";

export const Button = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "px-4 py-2 rounded-2xl text-sm font-medium transition-all",
        variant === "default" && "bg-blue-400 text-white hover:bg-blue-500",
        variant === "outline" && "border border-gray-300 hover:bg-gray-100",
        variant === "ghost" && "hover:bg-gray-50",
        className
      )}
      {...props}
    />
  );
});
Button.displayName = "Button";
