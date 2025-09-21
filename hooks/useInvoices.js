"use client";
import { useEffect, useMemo, useState, useCallback } from "react";
import { listenInvoices, createInvoice, updateInvoice, deleteInvoice, getInvoice } from "@/lib/firebase/invoices";
import { useAuth } from "@/hooks/useAuth";

export default function useInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setError(null);
      return;
    }

    let unsub;

    try {
      console.log('Setting up invoices listener for user:', user.uid);
      unsub = listenInvoices(user.uid, (rows) => {
        console.log('Received invoices in hook:', rows.length, 'invoices');
        setInvoices(rows);
        setLoading(false);
        setError(null);
      });
      console.log('Invoices listener setup complete');
    } catch (err) {
      console.error('Failed to set up invoices listener:', err);
      setError(err.message);
      setLoading(false);
    }

    return () => {
      if (unsub && typeof unsub === 'function') {
        try {
          console.log('Unsubscribing from invoices listener');
          unsub();
        } catch (err) {
          console.warn('Error unsubscribing from invoices listener:', err);
        }
      }
    };
  }, [user]);

  const add = useCallback(async (payload) => {
    if (!user) throw new Error("Not authenticated");

    try {
      console.log('Adding invoice:', payload);
      const result = await createInvoice({ ...payload, userId: user.uid });
      console.log('Invoice added successfully:', result);
      return result;
    } catch (err) {
      console.error('Failed to add invoice:', err);
      throw err;
    }
  }, [user]);

  const update = useCallback(async (id, payload) => {
    try {
      console.log('Updating invoice:', id, payload);
      await updateInvoice(id, payload);
      console.log('Invoice updated successfully');
    } catch (err) {
      console.error('Failed to update invoice:', err);
      throw err;
    }
  }, []);

  const remove = useCallback(async (id) => {
    try {
      console.log('Deleting invoice:', id);
      await deleteInvoice(id);
      console.log('Invoice deleted successfully');
    } catch (err) {
      console.error('Failed to delete invoice:', err);
      throw err;
    }
  }, []);

  const byId = useCallback(async (id) => {
    try {
      console.log('Fetching invoice by ID:', id);
      const result = await getInvoice(id);
      console.log('Invoice fetched:', result);
      return result;
    } catch (err) {
      console.error('Failed to fetch invoice:', err);
      throw err;
    }
  }, []);

  const customers = useMemo(() => {
    const map = new Map();
    invoices.forEach((inv) => {
      if (inv.customerName) map.set(inv.customerName, true);
    });
    return Array.from(map.keys()).sort();
  }, [invoices]);

  return { invoices, loading, error, add, update, remove, byId, customers };
}
