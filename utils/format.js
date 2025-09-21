import moment from "moment";

export function formatCurrency(value) {
  const n = Number(value || 0);
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

// Updated formatDate function using moment.js
export function formatDate(value) {
  if (!value) return "";

  try {
    let date = value;

    // Handle Firebase Timestamp
    if (value?.toDate) {
      date = value.toDate();
    }

    // Parse with moment and format
    const momentDate = moment(date);
    return momentDate.isValid() ? momentDate.format("YYYY-MM-DD HH:mm") : "";
  } catch {
    return "";
  }
}

/**
 * Formats a date string from one format to another
 * @param {string} date - The date string to format
 * @param {string} currentFormat - The current format of the date string
 * @param {string} desiredFormat - The desired format of the date string
 * @returns {string} - The formatted date string
 * @example formatDateString("2021-01-01", "YYYY-MM-DD", "MM/DD/YYYY") // Returns "01/01/2021"
 */
export function formatDateString(date, currentFormat, desiredFormat) {
  if (!date) return moment(new Date()).format(desiredFormat);

  try {
    // Parse the date using the current format
    const parsedDate = moment(date, currentFormat, true);

    // Check if the parsed date is valid
    if (!parsedDate.isValid()) {
      return moment(new Date()).format(desiredFormat);
    }

    // Return the date in the desired format
    return parsedDate.format(desiredFormat);
  } catch (error) {
    return moment(new Date()).format(desiredFormat);
  }
}

// Date format constants for better maintainability
export const DATE_FORMATS = {
  FULL_DATE_TIME: 1,           // October 2, 2023 at 9:02 AM
  FULL_DATE: 2,                // October 2, 2023
  SHORT_DATE: 3,               // Oct 2, 2023
  RELATIVE_TIME: 4,            // ... time ago
  ISO_DATE: 5,                 // 2024-01-08
  US_DATE: 6,                  // 01/08/2024
  SHORT_DATE_TIME: 7,          // DEC 6, 2018 08:16 PM
  DASH_DATE: 8,                // 01-08-2024
  TIME_12H: 9,                 // 07:28 am
  UTC_TO_LOCAL_TIME: 10,       // Convert UTC Time to Local
  FULL_DATE_TIME_NO_AT: 11,    // October 2, 2023 9:02 AM
  US_DATE_TIME: 12,            // 01/08/2024 9:02 AM
  TIME_12H_ALT: 13,            // Alternative time format
  UPPER_SHORT_DATE: 14,        // OCT 2, 2023
  UPPER_SHORT_DATE_TIME: 15,   // OCT 2, 2023 9:02 AM
  TIMEZONE_DATE: 16,           // Aug 2, 2024 at 5:43 PM GMT+5:30
  EST_FORMAT: 17,              // 20-Dec-2024/22:10 EST
  UTC_TO_LOCAL_FULL: 18,       // Feb 11, 2025 05:51 AM
  DAY_MONTH_YEAR: 19,          // 15 Oct, 2023
  UTC_FULL: 20,                // Feb 11, 2025 05:51 AM (UTC)
  UTC_TIMESTAMP: 21,           // 2025-04-04 14:23:30 (UTC)
  DAY_MONTH_YEAR_ALT: 22,      // 2 Jul, 2025
  UTC_TO_LOCAL_DATE: 23        // 01/08/2024
};

export function parseDateTimeString(date, type) {
  if (!date) return "";

  const formatMap = {
    [DATE_FORMATS.FULL_DATE_TIME]: () => moment(date).format("MMMM D, YYYY [at] h:mm A"),
    [DATE_FORMATS.FULL_DATE]: () => moment(date).format("MMMM D, YYYY"),
    [DATE_FORMATS.SHORT_DATE]: () => moment(date).format("MMM D, YYYY"),
    [DATE_FORMATS.RELATIVE_TIME]: () => moment(date).fromNow(),
    [DATE_FORMATS.ISO_DATE]: () => moment(date).format("YYYY-MM-DD"),
    [DATE_FORMATS.US_DATE]: () => moment(date).format("MM/DD/YYYY"),
    [DATE_FORMATS.SHORT_DATE_TIME]: () => moment(date).format("MMM D, YYYY hh:mm A"),
    [DATE_FORMATS.DASH_DATE]: () => moment(date).format("MM-DD-YYYY"),
    [DATE_FORMATS.TIME_12H]: () => moment(date, "HH:mm:ss").format("hh:mm A"),
    [DATE_FORMATS.UTC_TO_LOCAL_TIME]: () => moment.utc(date, "HH:mm:ss").local().format("hh:mm A"),
    [DATE_FORMATS.FULL_DATE_TIME_NO_AT]: () => moment(date).format("MMMM D, YYYY h:mm A"),
    [DATE_FORMATS.US_DATE_TIME]: () => moment(date).format("MM/DD/YYYY h:mm A"),
    [DATE_FORMATS.TIME_12H_ALT]: () => moment(date, "HH:mm:ss").format("hh:mm A"),
    [DATE_FORMATS.UPPER_SHORT_DATE]: () => moment(date).format("MMM D, YYYY").toUpperCase(),
    [DATE_FORMATS.UPPER_SHORT_DATE_TIME]: () => moment(date).format("MMM D, YYYY hh:mm A").toUpperCase(),
    [DATE_FORMATS.TIMEZONE_DATE]: () => moment(date).format("MMM D, YYYY [at] h:mm A [GMT]Z"),
    [DATE_FORMATS.EST_FORMAT]: () => moment(date).format("DD-MMM-YYYY/HH:mm [EST]"),
    [DATE_FORMATS.UTC_TO_LOCAL_FULL]: () => moment.utc(date, "YYYY-MM-DD HH:mm:ss").local().format("MMM D, YYYY hh:mm A"),
    [DATE_FORMATS.DAY_MONTH_YEAR]: () => moment(date).format("D MMM, YYYY"),
    [DATE_FORMATS.UTC_FULL]: () => moment.utc(date).format("MMM D, YYYY hh:mm A"),
    [DATE_FORMATS.UTC_TIMESTAMP]: () => moment.utc(date).format("YYYY-MM-DD HH:mm:ss"),
    [DATE_FORMATS.DAY_MONTH_YEAR_ALT]: () => moment(date).format("D MMM, YYYY"),
    [DATE_FORMATS.UTC_TO_LOCAL_DATE]: () => moment.utc(date, "YYYY-MM-DD HH:mm:ss").local().format("MM/DD/YYYY")
  };

  const formatter = formatMap[type];
  return formatter ? formatter() : date;
}

/**
 * Calculates a previous date by subtracting duration from the given date
 * @param {string|Date} expiryDate - The date to subtract from
 * @param {string} format - The format of the input/output date
 * @param {number} duration - The number of units to subtract
 * @param {string} unit - The unit of time ('years', 'months', 'days', 'hours', 'minutes', 'seconds')
 * @returns {string|null} - The calculated previous date in the same format, or null if invalid
 */
export function getPreviousDate(expiryDate, format, duration, unit = "days") {
  if (!expiryDate || !format || duration == null || duration < 0) return null;

  try {
    const parsedDate = moment(expiryDate, format, true);
    if (!parsedDate.isValid()) return null;

    return parsedDate.subtract(duration, unit).format(format);
  } catch (error) {
    return null;
  }
}

/**
 * Gets the current date formatted in the specified format
 * @param {string} format - The desired format (default: 'MM/DD/YYYY')
 * @returns {string} - The current date in the specified format
 */
export function getCurrentFormattedDate(format = 'MM/DD/YYYY') {
  try {
    return moment().format(format);
  } catch (error) {
    // Fallback to ISO format if custom format fails
    return moment().format('YYYY-MM-DD');
  }
}

/**
 * Converts a date string from one format to another
 * @param {string|Date} dateStr - The date string to convert
 * @param {string} inputFormat - The current format of the date string
 * @param {string} outputFormat - The desired output format
 * @returns {string} - The converted date string, or empty string if invalid
 */
export function convertDateFormat(dateStr, inputFormat, outputFormat) {
  if (!dateStr || !inputFormat || !outputFormat) return '';

  try {
    // Handle different input types
    let parsedDate;

    if (dateStr instanceof Date) {
      parsedDate = moment(dateStr);
    } else if (typeof dateStr === 'string' || typeof dateStr === 'number') {
      // Use strict parsing for string inputs with specific format
      parsedDate = moment(dateStr, inputFormat, true);
    } else {
      return '';
    }

    return parsedDate.isValid() ? parsedDate.format(outputFormat) : '';
  } catch (error) {
    return '';
  }
}

/**
 * Checks if a date is overdue (past current date)
 * @param {string|Date} date - The date to check
 * @returns {boolean} - True if the date is overdue
 */
export function isOverdue(date) {
  if (!date) return false;
  return moment(date).isBefore(moment(), 'day');
}

/**
 * Calculates days between two dates
 * @param {string|Date} startDate - The start date
 * @param {string|Date} endDate - The end date (default: current date)
 * @returns {number} - Number of days between dates
 */
export function daysBetween(startDate, endDate = new Date()) {
  if (!startDate) return 0;
  return moment(endDate).diff(moment(startDate), 'days');
}

/**
 * Adds duration to a date
 * @param {string|Date} date - The base date
 * @param {number} duration - The amount to add
 * @param {string} unit - The unit ('days', 'months', 'years', etc.)
 * @returns {Date|null} - The new date or null if invalid
 */
export function addToDate(date, duration, unit = 'days') {
  if (!date || duration == null) return null;

  try {
    const momentDate = moment(date);
    return momentDate.isValid() ? momentDate.add(duration, unit).toDate() : null;
  } catch (error) {
    return null;
  }
}

export function normalizeToDate(v) {
  if (!v) return null;
  if (v instanceof Date) return v;

  // Handle Firebase Timestamp
  if (v?.toDate) return v.toDate();

  // Use moment for better date parsing
  const momentDate = moment(v);
  return momentDate.isValid() ? momentDate.toDate() : null;
}

// Convenience functions for common date formats used in the invoice app
export const dateHelpers = {
  // For invoice table display
  invoiceDate: (date) => parseDateTimeString(date, DATE_FORMATS.SHORT_DATE),
  invoiceDateTime: (date) => parseDateTimeString(date, DATE_FORMATS.SHORT_DATE_TIME),

  // For forms and inputs
  inputDate: (date) => parseDateTimeString(date, DATE_FORMATS.ISO_DATE),
  inputDateTime: (date) => moment(date).format("YYYY-MM-DDTHH:mm"),

  // For display purposes
  displayDate: (date) => parseDateTimeString(date, DATE_FORMATS.FULL_DATE),
  displayDateTime: (date) => parseDateTimeString(date, DATE_FORMATS.FULL_DATE_TIME),

  // For relative time
  timeAgo: (date) => parseDateTimeString(date, DATE_FORMATS.RELATIVE_TIME),

  // For US format
  usDate: (date) => parseDateTimeString(date, DATE_FORMATS.US_DATE),
  usDateTime: (date) => parseDateTimeString(date, DATE_FORMATS.US_DATE_TIME),

  // Invoice-specific helpers
  isOverdue: (date) => isOverdue(date),
  daysPastDue: (dueDate) => isOverdue(dueDate) ? daysBetween(dueDate) : 0,
  daysUntilDue: (dueDate) => !isOverdue(dueDate) ? daysBetween(new Date(), dueDate) : 0,

  // Date calculations for invoices
  calculateDueDate: (createdDate, paymentTerms = 30) => addToDate(createdDate, paymentTerms, 'days'),
  formatForFilename: (date) => moment(date).format('YYYY-MM-DD'),

  // Validation helpers
  isValidDate: (date) => moment(date).isValid(),
  isFutureDate: (date) => moment(date).isAfter(moment()),
  isPastDate: (date) => moment(date).isBefore(moment())
};