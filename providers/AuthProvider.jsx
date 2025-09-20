"use client";
import React, { useEffect } from "react";
import { initializeAuthListener } from "@/lib/firebase/auth";

export function AuthProvider({ children }) {
  useEffect(() => {
    const unsubscribe = initializeAuthListener();
    return () => unsubscribe();
  }, []);

  return <>{children}</>;
}
