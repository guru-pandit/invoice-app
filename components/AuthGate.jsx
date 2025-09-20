"use client";
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Center, Spinner } from "@chakra-ui/react";
import { isPublicRoute, ROUTES } from "@/constants/routes";

export default function AuthGate({ children }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isPublic = isPublicRoute(pathname);

  useEffect(() => {
    if (!loading && !user && !isPublic) {
      router.replace(ROUTES.LOGIN);
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
