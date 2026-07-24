import { FC } from "react"
import VakuumBagsSection from "./vakuum-bags"

/**
 * Registry of static category "sections" — code-driven content blocks selected
 * via a category's `content_block_top` metadata when its value is prefixed with
 * `section-` (e.g. `section-vakuum-bags` → the "vakuum-bags" entry below).
 *
 * Add a new section: drop a component in this folder and register it here.
 */
export const SECTION_COMPONENTS: Record<string, FC<{ locale?: string }>> = {
  "vakuum-bags": VakuumBagsSection,
}

const SECTION_PREFIX = "section-"

/**
 * Resolves a `content_block_top` metadata value to a section component, or null
 * if the value doesn't name a section (then the category falls back to a DB
 * content block).
 */
export function getSectionComponent(
  value: string | null | undefined
): FC<{ locale?: string }> | null {
  if (!value || !value.startsWith(SECTION_PREFIX)) return null
  return SECTION_COMPONENTS[value.slice(SECTION_PREFIX.length)] ?? null
}

/** Is this metadata value a section reference (vs. a DB content-block key)? */
export function isSectionValue(value: string | null | undefined): boolean {
  return !!value && value.startsWith(SECTION_PREFIX)
}
