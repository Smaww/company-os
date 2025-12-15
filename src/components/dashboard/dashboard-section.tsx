"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface DashboardSectionProps {
  title: string;
  children: ReactNode;
  delay?: number;
}

export function DashboardSection({
  title,
  children,
  delay = 0,
}: DashboardSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#ff6b00] mb-3">
          {title}
        </h2>
        {/* Neon Divider */}
        <div className="h-[2px] bg-gradient-to-l from-transparent via-[#ff6b00]/50 to-[#ff6b00] rounded-full" 
          style={{
            boxShadow: "0 0 10px rgba(255, 107, 0, 0.3), 0 0 20px rgba(255, 107, 0, 0.1)"
          }}
        />
      </div>

      {/* Responsive Grid */}
      <div
        className={cn(
          "grid gap-4 md:gap-6",
          // Mobile First Responsive
          "grid-cols-1",      // 1 column on mobile
          "md:grid-cols-2",   // 2 columns on tablet
          "lg:grid-cols-3",   // 3 columns on desktop
          "xl:grid-cols-4"    // 4 columns on wide screen
        )}
      >
        {children}
      </div>
    </motion.section>
  );
}

