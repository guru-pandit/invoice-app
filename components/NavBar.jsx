"use client";
import React from "react";
import { Box, Button, HStack, Spacer, Text } from "@chakra-ui/react";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";
import ProfileDropdown from "@/components/ProfileDropdown";
import Link from "next/link";

export default function NavBar() {
  const { user } = useAuth();
  return (
    <HStack as={Box} px={4} py={3} borderBottomWidth="1px">
      <Text as={Link} href={ROUTES.HOME} fontWeight="bold">Invoice App</Text>
      <Spacer />
      {user ? (
        <ProfileDropdown />
      ) : (
        <Button as={Link} href={ROUTES.LOGIN} size="sm" colorScheme="teal">Login</Button>
      )}
    </HStack>
  );
}
