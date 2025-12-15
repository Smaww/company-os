"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

export interface DashboardCardProps {
  title: string;
  icon: LucideIcon;
  status?: string;
  statusVariant?: "default" | "success" | "warning" | "danger";
  href?: string;
  delay?: number;
}

const statusColors = {
  default: "bg-[#ff6b00]/15 text-[#ff6b00]",
  success: "bg-[#10b981]/15 text-[#10b981]",
  warning: "bg-[#f59e0b]/15 text-[#f59e0b]",
  danger: "bg-[#ef4444]/15 text-[#ef4444]",
};

export function DashboardCard({
  title,
  icon: Icon,
  status,
  statusVariant = "default",
  href = "#",
  delay = 0,
}: DashboardCardProps) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative block p-6 rounded-2xl cursor-pointer",
        // Glass Effect
        "bg-[#121214]/60 backdrop-blur-xl",
        "border border-white/5",
        // Shadow & Inner Glow
        "shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.05)]",
        // Hover Effects
        "hover:bg-[#121214]/80",
        "hover:border-[#ff6b00]/20",
        "hover:shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(255,107,0,0.15),inset_0_1px_0_0_rgba(255,255,255,0.08)]",
        // Transition
        "transition-all duration-300 ease-out"
      )}
    >
      {/* Corner Accent - Top Right */}
      <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
        <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-l from-[#ff6b00]/60 to-transparent" />
        <div className="absolute top-0 right-0 h-full w-[2px] bg-gradient-to-b from-[#ff6b00]/60 to-transparent" />
      </div>

      {/* Corner Accent - Bottom Left */}
      <div className="absolute bottom-0 left-0 w-8 h-8 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#ff6b00]/60 to-transparent" />
        <div className="absolute bottom-0 left-0 h-full w-[2px] bg-gradient-to-t from-[#ff6b00]/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Top Row: Icon */}
        <div className="flex items-start justify-between mb-4">
          <div
            className={cn(
              "p-3 rounded-xl",
              "bg-[#ff6b00]/10 border border-[#ff6b00]/20",
              "group-hover:bg-[#ff6b00]/15 group-hover:border-[#ff6b00]/30",
              "group-hover:shadow-[0_0_15px_rgba(255,107,0,0.2)]",
              "transition-all duration-300"
            )}
          >
            <Icon className="w-6 h-6 text-[#ff6b00]" />
          </div>

          {/* Status Badge */}
          {status && (
            <span
              className={cn(
                "px-2.5 py-1 rounded-full text-xs font-semibold",
                statusColors[statusVariant]
              )}
            >
              {status}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-[#ff6b00] transition-colors">
          {title}
        </h3>

        {/* Arrow Indicator */}
        <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <svg
            className="w-5 h-5 text-[#ff6b00] rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </div>
      </div>
    </motion.a>
  );
}

