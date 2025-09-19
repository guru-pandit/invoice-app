"use client";
import React from "react";
import { Box, Button, HStack, Spacer, Text } from "@chakra-ui/react";
import { useAuthContext } from "@/providers/AuthProvider";
import { signOutUser } from "@/lib/firebase/auth";
import Link from "next/link";

export default function NavBar() {
  const { user } = useAuthContext();
  return (
    <HStack as={Box} px={4} py={3} borderBottomWidth="1px">
      <Text as={Link} href="/" fontWeight="bold">Invoice App</Text>
      <Spacer />
      {user ? (
        <HStack>
          <Text fontSize="sm" color="gray.600">{user.email}</Text>
          <Button size="sm" onClick={signOutUser} variant="outline">Sign out</Button>
        </HStack>
      ) : (
        <Button as={Link} href="/login" size="sm" colorScheme="teal">Login</Button>
      )}
    </HStack>
  );
}
