/**
 * dateUtils.js
 *
 * Centralized date utility module for consistent formatting and manipulation across the app.
 *
 * Why this file exists:
 * - Prevents duplication of date logic between frontend and backend.
 * - Avoids locale quirks and off-by-one bugs caused by inconsistent formatting.
 * - Makes booking flows more predictable by standardizing how dates are handled.
 *
 * How it could be used:
 * - Replace native Date methods (e.g. toLocaleDateString, setDate) with reusable helpers.
 * - Use consistent ISO formatting (e.g. 'YYYY-MM-DD') for comparing, storing, and displaying dates.
 * - Integrate with date-fns for safer date math (e.g. addDays, differenceInCalendarDays).
 * - Improve timezone handling by normalizing dates to start-of-day before comparison.
 *
 * Next steps (when time allows):
 * - Refactor AvailabilityCalendar and backend validators to use these utilities.
 * - Migrate to TypeScript for stronger type safety and IDE support.
 * - Audit all date logic for consistency and edge case coverage.
 */
