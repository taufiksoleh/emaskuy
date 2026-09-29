import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Resolves a public/ asset path against the deployed base path (e.g. /emaskuy/
// on GitHub Pages) instead of the domain root.
export function withBase(path: string) {
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}
