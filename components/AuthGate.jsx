"use client";
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/AuthProvider";
import { Center, Spinner } from "@chakra-ui/react";

const PUBLIC_ROUTES = new Set(["/login", "/"]);

export default function AuthGate({ children }) {
  const { user, loading } = useAuthContext();
  const pathname = usePathname();
  const router = useRouter();

  const isPublic = PUBLIC_ROUTES.has(pathname || "/");

  useEffect(() => {
    if (!loading && !user && !isPublic) {
      router.replace("/login");
    }
  }, [loading, user, isPublic, router]);

  if (!isPublic && (loading || !user)) {
    return (
      <Center minH="60vh">
        <Spinner />
      </Center>
    );
  }

  return children;
}
