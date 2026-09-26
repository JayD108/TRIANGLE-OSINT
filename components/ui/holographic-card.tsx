import React from "react";
import { cn } from "@/lib/utils";

export interface HolographicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  accentColor?: "green" | "cyan" | "magenta";
  showCorners?: boolean;
}

export function HolographicCard({
  children,
  className,
  accentColor = "green",
  showCorners = true,
  ...props
}: HolographicCardProps) {
  const borderClasses = {
    green: "border-[#00ff88]/30 shadow-[0_0_15px_rgba(0,255,136,0.2)]",
    cyan: "border-[#00d4ff]/30 shadow-[0_0_15px_rgba(0,212,255,0.2)]",
    magenta: "border-[#ff00ff]/30 shadow-[0_0_15px_rgba(255,0,255,0.2)]",
  };

  const cornerClasses = {
    green: "border-[#00ff88]",
    cyan: "border-[#00d4ff]",
    magenta: "border-[#ff00ff]",
  };

  return (
    <div
      className={cn(
        "relative bg-[#1c1c2e]/30 border backdrop-blur-md transition-all duration-200",
        borderClasses[accentColor],
        className
      )}
      {...props}
    >
      {/* 4 small border corner accents at card edges using absolute positioning */}
      {showCorners && (
        <>
          <span
            className={cn(
              "absolute -top-[1px] -left-[1px] h-2.5 w-2.5 border-t-2 border-l-2 pointer-events-none",
              cornerClasses[accentColor]
            )}
          />
          <span
            className={cn(
              "absolute -top-[1px] -right-[1px] h-2.5 w-2.5 border-t-2 border-r-2 pointer-events-none",
              cornerClasses[accentColor]
            )}
          />
          <span
            className={cn(
              "absolute -bottom-[1px] -left-[1px] h-2.5 w-2.5 border-b-2 border-l-2 pointer-events-none",
              cornerClasses[accentColor]
            )}
          />
          <span
            className={cn(
              "absolute -bottom-[1px] -right-[1px] h-2.5 w-2.5 border-b-2 border-r-2 pointer-events-none",
              cornerClasses[accentColor]
            )}
          />
        </>
      )}
      {children}
    </div>
  );
}

export default HolographicCard;
