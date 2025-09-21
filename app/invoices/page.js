"use client";
import React, { useState } from "react";
import { Box, Button, Container, Heading, HStack, Stack, useDisclosure } from "@chakra-ui/react";
import useInvoices from "@/hooks/useInvoices";
import InvoiceTable from "@/components/InvoiceTable";
import ModalWrapper from "@/components/ModalWrapper";
import InvoiceForm from "@/components/InvoiceForm";
import { useRouter } from "next/navigation";
import { useToastMessages } from "@/hooks/popup";
import { invoice } from "@/constants/messages";

export default function InvoicesPage() {
  const { invoices, loading, remove, customers, add } = useInvoices();
  const router = useRouter();
  const { showSuccess, showError } = useToastMessages();
  const newModal = useDisclosure();

  const handleCreate = async (payload) => {
    try {
      const id = await add(payload);
      showSuccess(invoice.CREATED);
      newModal.onClose();
      router.push(`/invoices/${id}`);
    } catch (e) {
      showError(e.message);
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
          onRowClick={(row) => router.push(`/invoices/${row.id}`)}
          showActions={true}
        />

        <ModalWrapper title="Create Invoice" isOpen={newModal.isOpen} onClose={newModal.onClose} size="5xl">
          <InvoiceForm onSubmit={handleCreate} submitLabel="Save Invoice" />
        </ModalWrapper>
      </Stack>
    </Container>
  );
}
