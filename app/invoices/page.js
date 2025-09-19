"use client";
import React, { useMemo, useState } from "react";
import { Box, Button, Container, Heading, HStack, Stack, useDisclosure, useToast } from "@chakra-ui/react";
import useInvoices from "@/hooks/useInvoices";
import InvoiceTable from "@/components/InvoiceTable";
import ModalWrapper from "@/components/ModalWrapper";
import InvoiceForm from "@/components/InvoiceForm";
import { useRouter } from "next/navigation";

export default function InvoicesPage() {
  const { invoices, loading, remove, customers, add } = useInvoices();
  const [filters, setFilters] = useState({ customer: "", dateFrom: "", dateTo: "" });
  const router = useRouter();
  const toast = useToast();
  const newModal = useDisclosure();

  const handleCreate = async (payload) => {
    try {
      const id = await add(payload);
      toast({ status: "success", title: "Invoice created" });
      newModal.onClose();
      router.push(`/invoices/${id}`);
    } catch (e) {
      toast({ status: "error", title: "Failed to create", description: e.message });
    }
  };

  return (
    <Container maxW="7xl" py={10}>
      <Stack spacing={6}>
        <HStack justify="space-between">
          <Heading size="lg">Invoices</Heading>
          <Button onClick={newModal.onOpen} colorScheme="teal">New Invoice</Button>
        </HStack>
        <InvoiceTable
          invoices={invoices}
          loading={loading}
          onDelete={remove}
          customers={customers}
          filters={filters}
          setFilters={setFilters}
          onRowClick={(row) => router.push(`/invoices/${row.id}`)}
        />

        <ModalWrapper title="Create Invoice" isOpen={newModal.isOpen} onClose={newModal.onClose} size="5xl">
          <InvoiceForm onSubmit={handleCreate} submitLabel="Save Invoice" />
        </ModalWrapper>
      </Stack>
    </Container>
  );
}
