// Invoice status constants
export const INVOICE_STATUS = {
  DRAFT: "draft",
  SENT: "sent", 
  PAID: "paid",
  OVERDUE: "overdue"
};

// Array of valid invoice statuses for validation
export const INVOICE_STATUS_OPTIONS = Object.values(INVOICE_STATUS);

// Invoice status labels for UI display
export const INVOICE_STATUS_LABELS = {
  [INVOICE_STATUS.DRAFT]: "Draft",
  [INVOICE_STATUS.SENT]: "Sent",
  [INVOICE_STATUS.PAID]: "Paid", 
  [INVOICE_STATUS.OVERDUE]: "Overdue"
};

// Default values for invoice forms
export const DEFAULT_TAX_RATE = 0;
export const MIN_TAX_RATE = 0;
export const MAX_TAX_RATE = 100;
