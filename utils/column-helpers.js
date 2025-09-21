import { formatCurrency, formatDate } from "./format";

// Helper to safely get and format cell values
export const getCellValue = (info, formatter = (v) => v, fallback = "-") => {
    const value = info.getValue();
    return value != null ? formatter(value) : fallback;
};

// Helper for date cells
export const getDateCell = (info, format = "YYYY-MM-DD") =>
    getCellValue(info, (date) => formatDate(date, format));

// Helper for currency cells
export const getCurrencyCell = (info) =>
    getCellValue(info, (value) => formatCurrency(value), "$0.00");