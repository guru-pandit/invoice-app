"use client";
import React, { forwardRef } from "react";
import { Box, Heading, HStack, Stack, Table, Tbody, Td, Th, Thead, Tr, Text, Divider } from "@chakra-ui/react";
import { formatCurrency, formatDate } from "@/utils/format";

const InvoicePrint = forwardRef(function InvoicePrint({ invoice }, ref) {
  if (!invoice) return null;
  const items = invoice.items || [];
  return (
    <Box ref={ref} p={8} maxW="800px" mx="auto" bg="white" color="black">
      <HStack justify="space-between" align="start">
        <Heading size="lg">Invoice {invoice.number || ''}</Heading>
        <Stack textAlign="right" spacing={1}>
          <Text>Created: {formatDate(invoice.createdAt)}</Text>
          <Text>Due: {formatDate(invoice.dueDate)}</Text>
          <Text>Status: {invoice.status || ''}</Text>
        </Stack>
      </HStack>

      <Divider my={4} />

      <HStack justify="space-between" align="start" mb={6}>
        <Stack>
          <Text fontWeight="bold">Bill To</Text>
          <Text>{invoice.customerName}</Text>
          <Text>{invoice.customerEmail}</Text>
        </Stack>
        <Stack textAlign="right">
          <Text fontWeight="bold">Totals</Text>
          <Text>Subtotal: {formatCurrency(invoice.subtotal)}</Text>
          <Text>Tax: {formatCurrency(invoice.tax)}</Text>
          <Text>Total: {formatCurrency(invoice.total)}</Text>
        </Stack>
      </HStack>

      <Table size="sm" variant="striped">
        <Thead>
          <Tr>
            <Th>Description</Th>
            <Th isNumeric>Qty</Th>
            <Th isNumeric>Price</Th>
            <Th isNumeric>Amount</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map((it, idx) => (
            <Tr key={idx}>
              <Td>{it.description}</Td>
              <Td isNumeric>{it.qty}</Td>
              <Td isNumeric>{formatCurrency(it.price)}</Td>
              <Td isNumeric>{formatCurrency(it.amount ?? (Number(it.qty||0) * Number(it.price||0)))}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {invoice.notes ? (
        <Box mt={6}>
          <Text fontWeight="bold">Notes</Text>
          <Text whiteSpace="pre-wrap">{invoice.notes}</Text>
        </Box>
      ) : null}
    </Box>
  );
});

export default InvoicePrint;
