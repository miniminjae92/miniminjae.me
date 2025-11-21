// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Conditionally joins class names together and merges Tailwind CSS classes without conflict.
 * @param inputs - Array of class strings, objects, or arrays.
 * @returns Merged Tailwind class string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
