/**
 * Light-weight logger.
 *
 * - In development: forwards to `console.*` verbatim.
 * - In production: `debug` and `info` are silent. `warn` and `error` still
 *   go to the console so production issues remain observable.
 *
 * Drop-in replacement for raw `console.log/warn/error`:
 *
 *   import { logger } from "@/lib/logger";
 *   logger.warn("Translation missing", key);
 */

const isDev = process.env.NODE_ENV !== "production";

/* eslint-disable no-console */
export const logger = {
  debug: (...args: unknown[]): void => {
    if (isDev) console.debug(...args);
  },
  info: (...args: unknown[]): void => {
    if (isDev) console.info(...args);
  },
  warn: (...args: unknown[]): void => {
    console.warn(...args);
  },
  error: (...args: unknown[]): void => {
    console.error(...args);
  },
} as const;
