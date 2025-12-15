"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionGridProps {
  title: string;
  children: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * SectionGrid - Responsive grid container for dashboard sections
 * 
 * Breakpoints:
 * - Mobile: 1 column
 * - Tablet (md): 2 columns  
 * - Desktop (lg): 3 columns
 * - Ultra-wide (xl): 4 columns
 */
export function SectionGrid({
  title,
  children,
  delay = 0,
  className,
}: SectionGridProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={cn("w-full", className)}
    >
      {/* Section Header */}
      <div className="mb-6">
        {/* Title */}
        <h2 
          className="text-2xl md:text-3xl font-extrabold mb-4"
          style={{
            color: "#ff6b00",
            textShadow: "0 0 30px rgba(255, 107, 0, 0.4), 0 0 60px rgba(255, 107, 0, 0.2)",
          }}
        >
          {title}
        </h2>
        
        {/* Neon Divider */}
        <div 
          className="h-[2px] w-full rounded-full"
          style={{
            background: "linear-gradient(90deg, #ff6b00 0%, rgba(255, 107, 0, 0.3) 50%, transparent 100%)",
            boxShadow: "0 0 15px rgba(255, 107, 0, 0.5), 0 0 30px rgba(255, 107, 0, 0.2)",
          }}
        />
      </div>

      {/* Responsive Grid - STRICT breakpoints */}
      <div
        className={cn(
          "grid gap-6",
          // Mobile First - Stack vertically
          "grid-cols-1",
          // Tablet - 2 columns
          "md:grid-cols-2",
          // Desktop - 3 columns
          "lg:grid-cols-3",
          // Ultra-wide - 4 columns
          "xl:grid-cols-4"
        )}
      >
        {children}
      </div>
    </motion.section>
  );
}

