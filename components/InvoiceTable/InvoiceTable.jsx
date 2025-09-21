"use client";
import React, { useMemo, useState } from "react";
import { Box, Button, HStack, Input, Select, Spinner, Stack, Text } from "@chakra-ui/react";
import { useReactTable, getCoreRowModel, getFilteredRowModel, getSortedRowModel, flexRender } from "@tanstack/react-table";
import { exportInvoicesToExcel } from "@/utils/exportExcel";
import { DownloadIcon } from "@chakra-ui/icons";
import { useToastMessages } from "@/hooks/popup";
import { invoiceTableColumns } from "./columns";

export default function InvoiceTable({ invoices, loading, onDelete, onEdit, customers, onRowClick, showActions = true }) {
  const { showError } = useToastMessages();
  const [filters, setFilters] = useState({ customer: "", dateFrom: "", dateTo: "" });

  // Get columns with handlers
  const columns = useMemo(() => 
    invoiceTableColumns({ 
      showActions, 
      onEdit: (invoice) => onEdit && onEdit(invoice),
      onDelete: (invoice) => onDelete && onDelete(invoice.id)
    }), 
    [showActions, onEdit, onDelete]
  );

  const table = useReactTable({
    data: invoices || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const applyExport = () => {
    try {
      exportInvoicesToExcel(filteredData());
    } catch (e) {
      showError(e.message);
    }
  };

  const filteredData = () => {
    let rows = invoices || [];
    if (filters.customer) rows = rows.filter((r) => r.customerName?.includes(filters.customer));
    if (filters.dateFrom) rows = rows.filter((r) => {
      const d = r.createdAt?.toDate ? r.createdAt.toDate() : new Date(r.createdAt);
      return d >= new Date(filters.dateFrom);
    });
    if (filters.dateTo) rows = rows.filter((r) => {
      const d = r.createdAt?.toDate ? r.createdAt.toDate() : new Date(r.createdAt);
      return d <= new Date(filters.dateTo);
    });
    return rows;
  };

  return (
    <Stack spacing={4}>
      <HStack wrap="wrap" spacing={3}>
        <Select 
          placeholder="Filter by customer" 
          value={filters.customer} 
          onChange={(e) => setFilters((f) => ({ ...f, customer: e.target.value }))} 
          maxW="250px"
        >
          {customers.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
        <HStack>
          <Text>From</Text>
          <Input 
            type="datetime-local" 
            value={filters.dateFrom} 
            onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))} 
          />
        </HStack>
        <HStack>
          <Text>To</Text>
          <Input 
            type="datetime-local" 
            value={filters.dateTo} 
            onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))} 
          />
        </HStack>
        <Button 
          variant="outline" 
          onClick={() => setFilters({ customer: "", dateFrom: "", dateTo: "" })}
        >
          Clear
        </Button>
        <Button leftIcon={<DownloadIcon />} onClick={applyExport}>
          Export Excel
        </Button>
      </HStack>

      <Box borderWidth="1px" borderRadius="md" overflowX="auto">
        {loading ? (
          <HStack p={6}><Spinner /><Text>Loading...</Text></HStack>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => (
                    <th key={header.id} style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #eee" }}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr 
                  key={row.id} 
                  onClick={() => onRowClick && onRowClick(row.original)}
                  style={{ cursor: onRowClick ? "pointer" : "default" }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} style={{ padding: "8px", borderBottom: "1px solid #f0f0f0" }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Box>
    </Stack>
  );
}
