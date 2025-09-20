import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  invoices: [],
  loading: false,
  error: null,
  selectedInvoice: null,
};

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    setInvoices: (state, action) => {
      state.invoices = action.payload;
      state.loading = false;
      state.error = null;
    },
    addInvoice: (state, action) => {
      state.invoices.push(action.payload);
    },
    updateInvoice: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.invoices.findIndex(invoice => invoice.id === id);
      if (index !== -1) {
        state.invoices[index] = { ...state.invoices[index], ...updates };
      }
    },
    removeInvoice: (state, action) => {
      state.invoices = state.invoices.filter(invoice => invoice.id !== action.payload);
    },
    setSelectedInvoice: (state, action) => {
      state.selectedInvoice = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearInvoices: (state) => {
      return initialState;
    },
  },
});

export const {
  setInvoices,
  addInvoice,
  updateInvoice,
  removeInvoice,
  setSelectedInvoice,
  setLoading,
  setError,
  clearInvoices,
} = invoicesSlice.actions;

// Selectors
export const selectInvoices = (state) => state.invoices.invoices;
export const selectInvoicesLoading = (state) => state.invoices.loading;
export const selectInvoicesError = (state) => state.invoices.error;
export const selectSelectedInvoice = (state) => state.invoices.selectedInvoice;

// Computed selectors
export const selectInvoiceById = (id) => (state) =>
  state.invoices.invoices.find(invoice => invoice.id === id);

export const selectInvoicesByStatus = (status) => (state) =>
  state.invoices.invoices.filter(invoice => invoice.status === status);

export default invoicesSlice.reducer;
