// File: src/lib/utils.ts
import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines and merges class names using clsx and tailwind-merge
 */
export function cn(...inputs: Array<ClassValue | undefined>): string {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const merged: string = clsx(inputs);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  return twMerge(merged);
}