"use client";
import { useCallback, useEffect, useState } from "react";
import { listenCustomers, createCustomer, updateCustomer, deleteCustomer, getCustomer } from "@/lib/firebase/customers";
import { useAuthContext } from "@/providers/AuthProvider";

export default function useCustomers() {
  const { user } = useAuthContext();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsub = listenCustomers(user.uid, (rows) => {
      setCustomers(rows);
      setLoading(false);
    });
    return () => unsub && unsub();
  }, [user]);

  const add = useCallback(async (payload) => {
    if (!user) throw new Error("Not authenticated");
    return await createCustomer({ ...payload, userId: user.uid });
  }, [user]);

  const update = useCallback(async (id, payload) => {
    await updateCustomer(id, payload);
  }, []);

  const remove = useCallback(async (id) => {
    await deleteCustomer(id);
  }, []);

  const byId = useCallback(async (id) => {
    return await getCustomer(id);
  }, []);

  return { customers, loading, add, update, remove, byId };
}
