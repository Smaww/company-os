"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  corners?: boolean;
  delay?: number;
  hover?: boolean;
}

/**
 * Premium Glass Card Component
 * Implements the "Phoenix Energy" glassmorphism aesthetic
 */
export function GlassCard({
  children,
  className,
  glow = false,
  corners = true,
  delay = 0,
  hover = true,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
      className={cn(
        // Base Glass Effect
        "relative overflow-hidden rounded-3xl",
        "bg-[#121214]/60 backdrop-blur-xl",
        "border border-white/5",
        "shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.05)]",
        // Hover Effect
        hover && [
          "transition-all duration-500 ease-out",
          "hover:bg-[#121214]/75",
          "hover:border-[#ff6b00]/15",
          "hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6),0_0_40px_rgba(255,107,0,0.1),inset_0_1px_0_0_rgba(255,255,255,0.08)]",
          "hover:-translate-y-1",
        ],
        // Glow State
        glow && [
          "border-[#ff6b00]/20",
          "shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_40px_rgba(255,107,0,0.15),inset_0_1px_0_0_rgba(255,255,255,0.08)]",
        ],
        className
      )}
    >
      {/* Corner Accents */}
      {corners && (
        <>
          {/* Top Right Corner */}
          <div className="absolute top-0 right-0 w-10 h-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-l from-[#ff6b00]/70 via-[#ff6b00]/30 to-transparent" />
            <div className="absolute top-0 right-0 h-full w-[2px] bg-gradient-to-b from-[#ff6b00]/70 via-[#ff6b00]/30 to-transparent" />
          </div>
          {/* Bottom Left Corner */}
          <div className="absolute bottom-0 left-0 w-10 h-10 pointer-events-none">
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#ff6b00]/70 via-[#ff6b00]/30 to-transparent" />
            <div className="absolute bottom-0 left-0 h-full w-[2px] bg-gradient-to-t from-[#ff6b00]/70 via-[#ff6b00]/30 to-transparent" />
          </div>
        </>
      )}

      {/* Subtle Top Highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

/**
 * KPI Card - Optimized for large numbers
 */
interface KpiCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  delay?: number;
  accentColor?: "orange" | "green" | "red";
}

export function KpiCard({
  icon,
  label,
  value,
  trend,
  delay = 0,
  accentColor = "orange",
}: KpiCardProps) {
  const accentColors = {
    orange: "from-[#ff6b00]/20 to-transparent",
    green: "from-[#10b981]/20 to-transparent",
    red: "from-[#ef4444]/20 to-transparent",
  };

  return (
    <GlassCard delay={delay} className="h-40">
      {/* Accent Gradient */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-50 pointer-events-none rounded-3xl",
          accentColors[accentColor]
        )} 
      />

      <div className="relative p-6 h-full flex flex-col justify-between">
        {/* Top Row: Icon + Trend */}
        <div className="flex items-start justify-between">
          <div className="p-3 rounded-2xl bg-[#ff6b00]/10 border border-[#ff6b00]/20">
            {icon}
          </div>
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold",
                trend.direction === "up"
                  ? "bg-[#10b981]/15 text-[#10b981]"
                  : "bg-[#ef4444]/15 text-[#ef4444]"
              )}
            >
              <span>{trend.direction === "up" ? "↑" : "↓"}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>

        {/* Bottom Row: Label + Value */}
        <div>
          <p className="text-label mb-2">{label}</p>
          <p className="text-kpi">{value}</p>
        </div>
      </div>
    </GlassCard>
  );
}

/**
 * Section Card with Header
 */
interface SectionCardProps {
  title: string;
  subtitle?: string;
  icon: ReactNode;
  badge?: ReactNode;
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function SectionCard({
  title,
  subtitle,
  icon,
  badge,
  children,
  className,
  delay = 0,
}: SectionCardProps) {
  return (
    <GlassCard delay={delay} className={className}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-[#ff6b00]/10 border border-[#ff6b00]/20 neon-glow-sm">
            {icon}
          </div>
          <div>
            <h3 className="text-section">{title}</h3>
            {subtitle && (
              <p className="text-label-sm mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        {badge && <div>{badge}</div>}
      </div>

      {/* Divider */}
      <div className="mx-6 neon-divider" />

      {/* Content */}
      <div className="p-6 pt-4">{children}</div>
    </GlassCard>
  );
}
