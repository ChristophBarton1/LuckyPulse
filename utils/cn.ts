/**
 * Minimal class-name composer (no clsx/tailwind-merge dependency).
 * Accepts strings, falsy values (skipped), and `Record<string, boolean>` toggles.
 *
 * Our components author mutually-exclusive variant maps, so naive Tailwind class
 * conflicts don't occur and a full tailwind-merge pass isn't needed.
 */
export type ClassValue = string | false | null | undefined | Record<string, boolean>

export function cn(...parts: ClassValue[]): string {
  const out: string[] = []
  for (const part of parts) {
    if (!part) continue
    if (typeof part === 'string') {
      if (part.trim()) out.push(part.trim())
    } else {
      for (const key in part) {
        if (part[key]) out.push(key)
      }
    }
  }
  return out.join(' ')
}
