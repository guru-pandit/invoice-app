import { format } from "date-fns";

export function formatCurrency(value) {
  const n = Number(value || 0);
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

export function formatDate(value) {
  if (!value) return "";
  let d = value;
  if (typeof value === "string" || typeof value === "number") d = new Date(value);
  if (value?.toDate) d = value.toDate();
  try {
    return format(d, "yyyy-MM-dd HH:mm");
  } catch {
    return "";
  }
}
