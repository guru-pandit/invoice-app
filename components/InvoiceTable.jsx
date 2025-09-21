"use client";
import React, { useMemo } from "react";
import { Box, HStack, Spinner, Stack, Text } from "@chakra-ui/react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { exportInvoicesToExcel } from "@/utils/exportExcel";
import { useToastMessages } from "@/hooks/popup";
import { invoiceTableColumns } from "@/components/InvoiceTable/columns";
import FilterControls from "./InvoiceTable/FilterControls";

export default function InvoiceTable({ invoices, loading, onDelete, customers, filters, setFilters, onRowClick }) {
    const { showError } = useToastMessages();

  // Ensure filters has default values to prevent undefined errors
  const safeFilters = {
    customer: "",
    dateFrom: "",
    dateTo: "",
    ...filters
  };

  const columns = useMemo(() => (
    invoiceTableColumns({
      onEdit: (row) => {
        if (onRowClick) onRowClick(row);
      },
      onDelete: (row) => {
        if (onDelete) onDelete(row.id);
      }
    })
  ), [onDelete, onRowClick]);

  const table = useReactTable({
    data: invoices || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
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
    if (safeFilters.customer) rows = rows.filter((r) => r.customerName === safeFilters.customer);
    if (safeFilters.dateFrom) rows = rows.filter((r) => {
      const d = r.createdAt?.toDate ? r.createdAt.toDate() : new Date(r.createdAt);
      return d >= new Date(safeFilters.dateFrom);
    });
    if (safeFilters.dateTo) rows = rows.filter((r) => {
      const d = r.createdAt?.toDate ? r.createdAt.toDate() : new Date(r.createdAt);
      return d <= new Date(safeFilters.dateTo);
    });
    return rows;
  };

  return (
    <Stack spacing={4}>
      <FilterControls
        filters={safeFilters}
        setFilters={setFilters}
        customers={customers}
        onExport={applyExport}
        onClear={() => setFilters({ customer: "", dateFrom: "", dateTo: "" })}
      />

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
                <tr key={row.id} style={{ cursor: onRowClick ? "pointer" : "default" }} onClick={() => onRowClick && onRowClick(row.original)}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} style={{ padding: "8px", borderBottom: "1px solid #f3f3f3" }}>
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
