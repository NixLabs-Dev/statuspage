import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export function pad_array(arr: any[], len: number, fill: any) {
  const padding = Array(len).fill(fill); // Create an array of padding elements
  return padding.concat(arr).slice(-len); // Reverse arr, add padding before it, and slice from the end
}
