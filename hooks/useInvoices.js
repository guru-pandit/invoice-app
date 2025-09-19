"use client";
import { useEffect, useMemo, useState, useCallback } from "react";
import { listenInvoices, createInvoice, updateInvoice, deleteInvoice, getInvoice } from "@/lib/firebase/invoices";
import { useAuthContext } from "@/providers/AuthProvider";

export default function useInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) return;
    const unsub = listenInvoices(user.uid, (rows) => {
      setInvoices(rows);
      setLoading(false);
    });
    return () => unsub && unsub();
  }, [user]);

  const add = useCallback(async (payload) => {
    if (!user) throw new Error("Not authenticated");
    return await createInvoice({ ...payload, userId: user.uid });
  }, [user]);

  const update = useCallback(async (id, payload) => {
    await updateInvoice(id, payload);
  }, []);

  const remove = useCallback(async (id) => {
    await deleteInvoice(id);
  }, []);

  const byId = useCallback(async (id) => {
    return await getInvoice(id);
  }, []);

  const customers = useMemo(() => {
    const map = new Map();
    invoices.forEach((inv) => {
      if (inv.customerName) map.set(inv.customerName, true);
    });
    return Array.from(map.keys()).sort();
  }, [invoices]);

  return { invoices, loading, add, update, remove, byId, customers };
}
