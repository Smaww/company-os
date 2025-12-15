import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as currency (SAR - Saudi Riyal)
 * With Arabic locale formatting
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("ar-SA", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value) + " ر.س";
}

/**
 * Format large numbers with Arabic K/M suffix
 */
export function formatNumber(value: number): string {
  if (value >= 1000000) {
    return new Intl.NumberFormat("ar-SA").format(Math.round(value / 1000000)) + " م";
  }
  if (value >= 1000) {
    return new Intl.NumberFormat("ar-SA").format(Math.round(value / 1000)) + " ألف";
  }
  return new Intl.NumberFormat("ar-SA").format(value);
}

/**
 * Format a number as percentage with +/- sign
 */
export function formatPercentage(value: number): string {
  const formatted = new Intl.NumberFormat("ar-SA", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(Math.abs(value));
  return `${value > 0 ? "+" : "-"}${formatted}%`;
}

/**
 * Convert Western numerals to Arabic-Indic numerals
 */
export function toArabicNumerals(num: number | string): string {
  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return num.toString().replace(/[0-9]/g, (d) => arabicNumerals[parseInt(d)]);
}

/**
 * Get relative time string in Arabic
 */
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "الآن";
  if (diffInSeconds < 3600) return `منذ ${Math.floor(diffInSeconds / 60)} دقيقة`;
  if (diffInSeconds < 86400) return `منذ ${Math.floor(diffInSeconds / 3600)} ساعة`;
  return `منذ ${Math.floor(diffInSeconds / 86400)} يوم`;
}
