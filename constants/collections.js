// Collection names constants
export const COLLECTIONS = {
  CUSTOMERS: 'customers',
  INVOICES: 'invoices',
  USERS: 'users',
};

// Field names constants
export const FIELDS = {
  // Common fields
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
  USER_ID: 'userId',

  // Customer specific fields
  CUSTOMER_NAME: 'name',
  CUSTOMER_EMAIL: 'email',
  CUSTOMER_PHONE: 'phone',

  // Invoice specific fields
  INVOICE_NUMBER: 'number',
  INVOICE_STATUS: 'status',
  INVOICE_DUE_DATE: 'dueDate',
  INVOICE_SUBTOTAL: 'subtotal',
  INVOICE_TAX: 'tax',
  INVOICE_TOTAL: 'total',
  INVOICE_ITEMS: 'items',
};

// Query constants
export const QUERY_ORDER = {
  DESC: 'desc',
  ASC: 'asc',
};
