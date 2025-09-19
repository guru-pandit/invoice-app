"use client";
import React, { useMemo, useRef } from "react";
import {
  Box,
  Button,
  HStack,
  IconButton,
  Input,
  Select,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useReactTable, getCoreRowModel, getFilteredRowModel, getSortedRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import { formatCurrency, formatDate } from "@/utils/format";
import { exportInvoicesToExcel } from "@/utils/exportExcel";
import { DeleteIcon, DownloadIcon } from "@chakra-ui/icons";

const columnHelper = createColumnHelper();

export default function InvoiceTable({ invoices, loading, onDelete, customers, filters, setFilters, onRowClick }) {
  const toast = useToast();

  const columns = useMemo(() => [
    columnHelper.accessor("number", { header: "Number", cell: (info) => info.getValue() || "-" }),
    columnHelper.accessor("customerName", { header: "Customer", cell: (info) => info.getValue() || "-" }),
    columnHelper.accessor("createdAt", { header: "Created At", cell: (info) => formatDate(info.row.original.createdAt) }),
    columnHelper.accessor("dueDate", { header: "Due Date", cell: (info) => formatDate(info.row.original.dueDate) }),
    columnHelper.accessor("total", { header: "Total", cell: (info) => formatCurrency(info.getValue()) }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <HStack>
          <IconButton aria-label="Delete" colorScheme="red" size="sm" icon={<DeleteIcon />} onClick={(e) => { e.stopPropagation(); onDelete && onDelete(row.original.id); }} />
        </HStack>
      )
    })
  ], [onDelete]);

  const table = useReactTable({
    data: invoices || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {},
  });

  const applyExport = () => {
    try {
      exportInvoicesToExcel(filteredData());
    } catch (e) {
      toast({ status: "error", title: "Export failed", description: e.message });
    }
  };

  const filteredData = () => {
    let rows = invoices || [];
    if (filters.customer) rows = rows.filter((r) => r.customerName === filters.customer);
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
        <Select placeholder="Filter by customer" value={filters.customer} onChange={(e) => setFilters((f) => ({ ...f, customer: e.target.value }))} maxW="250px">
          {customers.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
        <HStack>
          <Text>From</Text>
          <Input type="datetime-local" value={filters.dateFrom} onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))} />
        </HStack>
        <HStack>
          <Text>To</Text>
          <Input type="datetime-local" value={filters.dateTo} onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))} />
        </HStack>
        <Button variant="outline" onClick={() => setFilters({ customer: "", dateFrom: "", dateTo: "" })}>Clear</Button>
        <Button leftIcon={<DownloadIcon />} onClick={applyExport}>Export Excel</Button>
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
              {filteredData().map((row, idx) => (
                <tr key={row.id || idx} style={{ cursor: onRowClick ? "pointer" : "default" }} onClick={() => onRowClick && onRowClick(row)}>
                  <td style={{ padding: "8px", borderBottom: "1px solid #f3f3f3" }}>{row.number || "-"}</td>
                  <td style={{ padding: "8px", borderBottom: "1px solid #f3f3f3" }}>{row.customerName || "-"}</td>
                  <td style={{ padding: "8px", borderBottom: "1px solid #f3f3f3" }}>{formatDate(row.createdAt)}</td>
                  <td style={{ padding: "8px", borderBottom: "1px solid #f3f3f3" }}>{formatDate(row.dueDate)}</td>
                  <td style={{ padding: "8px", borderBottom: "1px solid #f3f3f3" }}>{formatCurrency(row.total)}</td>
                  <td style={{ padding: "8px", borderBottom: "1px solid #f3f3f3" }}>
                    <IconButton aria-label="Delete" colorScheme="red" size="sm" icon={<DeleteIcon />} onClick={(e) => { e.stopPropagation(); onDelete && onDelete(row.id); }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Box>
    </Stack>
  );
}
