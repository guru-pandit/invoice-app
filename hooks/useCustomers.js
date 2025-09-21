"use client";
import { useCallback, useEffect, useState } from "react";
import { listenCustomers, createCustomer, updateCustomer, deleteCustomer, getCustomer } from "@/lib/firebase/customers";
import { useAuth } from "@/hooks/useAuth";

export default function useCustomers() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setError(null);
      return;
    }

    let unsub;

    try {
      console.log('Setting up customers listener for user:', user.uid);
      unsub = listenCustomers(user.uid, (rows) => {
        console.log('Received customers in hook:', rows.length, 'customers');
        // Sort by createdAt descending (newest first)
        const sortedRows = rows.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
          return dateB - dateA;
        });
        console.log('Sorted customers:', sortedRows);
        setCustomers(sortedRows);
        setLoading(false);
        setError(null);
      });
      console.log('Customers listener setup complete');
    } catch (err) {
      console.error('Failed to set up customers listener:', err);
      setError(err.message);
      setLoading(false);
    }

    return () => {
      if (unsub && typeof unsub === 'function') {
        try {
          console.log('Unsubscribing from customers listener');
          unsub();
        } catch (err) {
          console.warn('Error unsubscribing from customers listener:', err);
        }
      }
    };
  }, [user]);

  const add = useCallback(async (payload) => {
    if (!user) throw new Error("Not authenticated");

    try {
      console.log('Adding customer:', payload);
      const result = await createCustomer({ ...payload, userId: user.uid });
      console.log('Customer added successfully:', result);
      return result;
    } catch (err) {
      console.error('Failed to add customer:', err);
      throw err;
    }
  }, [user]);

  const update = useCallback(async (id, payload) => {
    try {
      console.log('Updating customer:', id, payload);
      await updateCustomer(id, payload);
      console.log('Customer updated successfully');
    } catch (err) {
      console.error('Failed to update customer:', err);
      throw err;
    }
  }, []);

  const remove = useCallback(async (id) => {
    try {
      console.log('Deleting customer:', id);
      await deleteCustomer(id);
      console.log('Customer deleted successfully');
    } catch (err) {
      console.error('Failed to delete customer:', err);
      throw err;
    }
  }, []);

  const byId = useCallback(async (id) => {
    try {
      console.log('Fetching customer by ID:', id);
      const result = await getCustomer(id);
      console.log('Customer fetched:', result);
      return result;
    } catch (err) {
      console.error('Failed to fetch customer:', err);
      throw err;
    }
  }, []);

  return { customers, loading, error, add, update, remove, byId };
}
