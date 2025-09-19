"use client";
import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Container, HStack, Heading, Spinner, Stack, useToast } from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import useInvoices from "@/hooks/useInvoices";
import InvoiceForm from "@/components/InvoiceForm";
import InvoicePrint from "@/components/InvoicePrint";
import { useReactToPrint } from "react-to-print";

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const { byId, update, remove } = useInvoices();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await byId(id);
        if (mounted) setInvoice(data);
      } catch (e) {
        toast({ status: "error", title: "Failed to load", description: e.message });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id, byId, toast]);

  const printRef = useRef();
  const handlePrint = useReactToPrint({ content: () => printRef.current });

  const handleSave = async (payload) => {
    try {
      await update(id, payload);
      toast({ status: "success", title: "Invoice updated" });
    } catch (e) {
      toast({ status: "error", title: "Failed to update", description: e.message });
    }
  };

  const handleDelete = async () => {
    try {
      await remove(id);
      toast({ status: "success", title: "Invoice deleted" });
      router.push("/invoices");
    } catch (e) {
      toast({ status: "error", title: "Failed to delete", description: e.message });
    }
  };

  if (loading) {
    return (
      <Container maxW="6xl" py={10}>
        <HStack><Spinner /><Heading size="md">Loading...</Heading></HStack>
      </Container>
    );
  }

  if (!invoice) {
    return (
      <Container maxW="6xl" py={10}>
        <Heading size="md">Invoice not found</Heading>
      </Container>
    );
  }

  return (
    <Container maxW="6xl" py={10}>
      <Stack spacing={6}>
        <HStack justify="space-between">
          <Heading size="lg">Invoice {invoice.number}</Heading>
          <HStack>
            <Button onClick={handlePrint}>Print</Button>
            <Button colorScheme="red" variant="outline" onClick={handleDelete}>Delete</Button>
          </HStack>
        </HStack>
        <InvoiceForm initialValues={deserializeInvoice(invoice)} onSubmit={handleSave} submitLabel="Save Changes" />
        <Box display="none">
          <InvoicePrint ref={printRef} invoice={invoice} />
        </Box>
      </Stack>
    </Container>
  );
}

function deserializeInvoice(inv) {
  const toVal = (v) => (v?.toDate ? v.toDate() : v);
  const toLocalInput = (d) => {
    if (!d) return "";
    const dt = new Date(d);
    const pad = (n) => String(n).padStart(2, "0");
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
  };
  return {
    ...inv,
    createdAt: toLocalInput(toVal(inv.createdAt)),
    dueDate: toLocalInput(toVal(inv.dueDate)),
  };
}
