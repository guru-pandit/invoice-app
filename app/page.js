"use client";
import Link from "next/link";
import { Box, Button, Container, Heading, Stack, Text } from "@chakra-ui/react";

export default function HomePage() {
  return (
    <Container maxW="6xl" py={12}>
      <Stack spacing={8}>
        <Heading>Invoice Dashboard</Heading>
        <Text>Manage invoices: create, save, filter, print, and export.</Text>
        <Stack direction={{ base: "column", sm: "row" }} spacing={4}>
          <Button as={Link} href="/invoices" colorScheme="teal">Invoices</Button>
        </Stack>
      </Stack>
    </Container>
  );
}
