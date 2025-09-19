import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { formatDate } from "@/utils/format";

export function exportInvoicesToExcel(invoices, filename = "invoices.xlsx") {
  const rows = invoices.map((inv) => ({
    ID: inv.id,
    Number: inv.number || "",
    Customer: inv.customerName || "",
    Email: inv.customerEmail || "",
    CreatedAt: formatDate(inv.createdAt),
    DueDate: formatDate(inv.dueDate),
    Subtotal: inv.subtotal || 0,
    Tax: inv.tax || 0,
    Total: inv.total || 0,
    Status: inv.status || "",
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Invoices");
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([wbout], { type: "application/octet-stream" }), filename);
}
