export const BREAKPOINTS = {
  sm: 640,
  lg: 1024,
} as const;

export const MEDIA_QUERIES = {
  sm: `(min-width: ${BREAKPOINTS.sm}px)`,
  lg: `(min-width: ${BREAKPOINTS.lg}px)`,
} as const;
