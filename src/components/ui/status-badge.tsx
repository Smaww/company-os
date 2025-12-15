"use client";

import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";

interface StatusBadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  pulse?: boolean;
  dot?: boolean;
  size?: "sm" | "md";
  className?: string;
}

const variantConfig: Record<BadgeVariant, { bg: string; text: string; dot: string; glow: string }> = {
  success: {
    bg: "bg-[#10b981]/10",
    text: "text-[#10b981]",
    dot: "bg-[#10b981]",
    glow: "shadow-[0_0_10px_rgba(16,185,129,0.5)]",
  },
  warning: {
    bg: "bg-[#f59e0b]/10",
    text: "text-[#f59e0b]",
    dot: "bg-[#f59e0b]",
    glow: "shadow-[0_0_10px_rgba(245,158,11,0.5)]",
  },
  danger: {
    bg: "bg-[#ef4444]/10",
    text: "text-[#ef4444]",
    dot: "bg-[#ef4444]",
    glow: "shadow-[0_0_10px_rgba(239,68,68,0.5)]",
  },
  info: {
    bg: "bg-[#ff6b00]/10",
    text: "text-[#ff6b00]",
    dot: "bg-[#ff6b00]",
    glow: "shadow-[0_0_10px_rgba(255,107,0,0.5)]",
  },
  neutral: {
    bg: "bg-white/5",
    text: "text-[#9ca3af]",
    dot: "bg-[#9ca3af]",
    glow: "",
  },
};

export function StatusBadge({
  variant,
  children,
  pulse = false,
  dot = true,
  size = "md",
  className,
}: StatusBadgeProps) {
  const config = variantConfig[variant];
  const sizeClasses = {
    sm: "px-2 py-1 text-[10px]",
    md: "px-3 py-1.5 text-xs",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full font-semibold",
        "border border-white/5 backdrop-blur-sm",
        "transition-all duration-300",
        config.bg,
        config.text,
        sizeClasses[size],
        className
      )}
    >
      {dot && (
        <span className="relative flex h-2 w-2">
          {pulse && (
            <span
              className={cn(
                "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
                config.dot
              )}
            />
          )}
          <span
            className={cn(
              "relative inline-flex h-2 w-2 rounded-full",
              config.dot,
              pulse && config.glow
            )}
          />
        </span>
      )}
      {children}
    </span>
  );
}

/**
 * Status Indicator (Minimal dot only)
 */
interface StatusIndicatorProps {
  status: "online" | "idle" | "offline";
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
}

export function StatusIndicator({ 
  status, 
  size = "md",
  pulse = true 
}: StatusIndicatorProps) {
  const statusConfig = {
    online: { 
      color: "bg-[#10b981]", 
      glow: "shadow-[0_0_8px_rgba(16,185,129,0.6)]" 
    },
    idle: { 
      color: "bg-[#f59e0b]", 
      glow: "shadow-[0_0_8px_rgba(245,158,11,0.6)]" 
    },
    offline: { 
      color: "bg-[#4b5563]", 
      glow: "" 
    },
  };

  const sizes = {
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3",
  };

  const config = statusConfig[status];

  return (
    <span className="relative flex">
      {pulse && status !== "offline" && (
        <span
          className={cn(
            "absolute inline-flex h-full w-full rounded-full opacity-50 animate-ping",
            config.color
          )}
        />
      )}
      <span
        className={cn(
          "relative rounded-full",
          sizes[size],
          config.color,
          config.glow
        )}
      />
    </span>
  );
}

/**
 * Alert Item Component
 */
interface AlertItemProps {
  icon: React.ReactNode;
  source: string;
  title: string;
  description: string;
  timestamp: string;
  severity: "critical" | "warning" | "info";
  onClick?: () => void;
}

export function AlertItem({
  icon,
  source,
  title,
  description,
  timestamp,
  severity,
  onClick,
}: AlertItemProps) {
  const severityConfig = {
    critical: {
      border: "border-r-2 border-r-[#ef4444]",
      iconBg: "bg-[#ef4444]/10",
      iconColor: "text-[#ef4444]",
    },
    warning: {
      border: "border-r-2 border-r-[#f59e0b]",
      iconBg: "bg-[#f59e0b]/10",
      iconColor: "text-[#f59e0b]",
    },
    info: {
      border: "",
      iconBg: "bg-[#ff6b00]/10",
      iconColor: "text-[#ff6b00]",
    },
  };

  const config = severityConfig[severity];

  return (
    <div
      onClick={onClick}
      className={cn(
        "group p-4 rounded-2xl cursor-pointer",
        "bg-white/[0.02] border border-white/5",
        "hover:bg-white/[0.05] hover:border-[#ff6b00]/10",
        "transition-all duration-300",
        config.border
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={cn("p-2.5 rounded-xl shrink-0", config.iconBg)}>
          <div className={config.iconColor}>{icon}</div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge 
              variant={severity === "critical" ? "danger" : severity === "warning" ? "warning" : "info"} 
              dot={false}
              size="sm"
            >
              {source}
            </StatusBadge>
            <span className="text-[10px] text-[#6b7280]">{timestamp}</span>
          </div>
          <h4 className="text-sm font-semibold text-white truncate mb-0.5">
            {title}
          </h4>
          <p className="text-xs text-[#9ca3af] line-clamp-1">{description}</p>
        </div>

        {/* Arrow */}
        <div className="text-[#4b5563] group-hover:text-[#ff6b00] transition-colors">
          <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
