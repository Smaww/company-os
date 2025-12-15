"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
  badgeVariant?: "default" | "success" | "warning" | "danger";
  href?: string;
  delay?: number;
}

const badgeStyles = {
  default: "bg-[#ff6b00]/20 text-[#ff6b00] border-[#ff6b00]/30",
  success: "bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30",
  warning: "bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]/30",
  danger: "bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/30",
};

/**
 * DashboardCard - Phoenix-styled card with fixed height
 * 
 * Features:
 * - Fixed height: 180px
 * - Glassmorphism background
 * - Neon orange hover effects
 * - Large icon display
 */
export function DashboardCard({
  title,
  subtitle,
  icon: Icon,
  badge,
  badgeVariant = "default",
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
        // Layout
        "group relative block w-full h-[180px] p-6 rounded-2xl overflow-hidden",
        // Glass Background
        "bg-[#121214]/80 backdrop-blur-md",
        // Border
        "border border-white/10",
        // Hover Effects
        "hover:border-[#ff6b00]/50",
        "hover:shadow-[0_0_30px_rgba(255,107,0,0.15)]",
        // Transition
        "transition-all duration-300 ease-out",
        // Cursor
        "cursor-pointer"
      )}
    >
      {/* Background Gradient on Hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at top right, rgba(255, 107, 0, 0.08), transparent 70%)",
        }}
      />

      {/* Corner Accent - Top Right */}
      <div className="absolute top-0 right-0 w-12 h-12 pointer-events-none">
        <div 
          className="absolute top-0 right-0 w-full h-[2px] opacity-40 group-hover:opacity-100 transition-opacity"
          style={{ background: "linear-gradient(270deg, #ff6b00, transparent)" }}
        />
        <div 
          className="absolute top-0 right-0 h-full w-[2px] opacity-40 group-hover:opacity-100 transition-opacity"
          style={{ background: "linear-gradient(180deg, #ff6b00, transparent)" }}
        />
      </div>

      {/* Corner Accent - Bottom Left */}
      <div className="absolute bottom-0 left-0 w-12 h-12 pointer-events-none">
        <div 
          className="absolute bottom-0 left-0 w-full h-[2px] opacity-40 group-hover:opacity-100 transition-opacity"
          style={{ background: "linear-gradient(90deg, #ff6b00, transparent)" }}
        />
        <div 
          className="absolute bottom-0 left-0 h-full w-[2px] opacity-40 group-hover:opacity-100 transition-opacity"
          style={{ background: "linear-gradient(0deg, #ff6b00, transparent)" }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col justify-between">
        {/* Top Row: Badge + Icon */}
        <div className="flex items-start justify-between">
          {/* Badge */}
          {badge && (
            <span
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-bold border",
                badgeStyles[badgeVariant]
              )}
            >
              {badge}
            </span>
          )}
          
          {/* Icon */}
          <div 
            className={cn(
              "p-3 rounded-xl transition-all duration-300",
              "bg-[#ff6b00]/10 border border-[#ff6b00]/20",
              "group-hover:bg-[#ff6b00]/20 group-hover:border-[#ff6b00]/40",
              "group-hover:shadow-[0_0_20px_rgba(255,107,0,0.3)]",
              !badge && "mr-auto" // RTL: align to right if no badge
            )}
          >
            <Icon 
              className="w-7 h-7 text-[#ff6b00]" 
              strokeWidth={1.5}
            />
          </div>
        </div>

        {/* Bottom Row: Title + Subtitle */}
        <div>
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#ff6b00] transition-colors">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Arrow Indicator (appears on hover) */}
      <div 
        className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"
      >
        <svg
          className="w-5 h-5 text-[#ff6b00] rotate-180"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </div>
    </motion.a>
  );
}

