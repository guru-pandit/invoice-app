"use client";
import React from "react";
import { Container, Heading, Stack, useToast } from "@chakra-ui/react";
import InvoiceForm from "@/components/InvoiceForm";
import useInvoices from "@/hooks/useInvoices";
import { useRouter } from "next/navigation";

export default function NewInvoicePage() {
  const { add } = useInvoices();
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (payload) => {
    try {
      const id = await add(payload);
      toast({ status: "success", title: "Invoice saved" });
      router.push(`/invoices/${id}`);
    } catch (e) {
      toast({ status: "error", title: "Failed to save", description: e.message });
    }
  };

  return (
    <Container maxW="6xl" py={10}>
      <Stack spacing={6}>
        <Heading size="lg">Create Invoice</Heading>
        <InvoiceForm onSubmit={handleSubmit} submitLabel="Save Invoice" />
      </Stack>
    </Container>
  );
}
