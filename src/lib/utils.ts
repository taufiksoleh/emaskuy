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

/** Replace `{name}` placeholders, e.g. in translated strings. */
export function fill(text: string, vars: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
}
