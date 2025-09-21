import { db } from "@/lib/firebase/firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, where, query, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import { COLLECTIONS, FIELDS, QUERY_ORDER } from "@/constants/collections";

const invoicesCol = collection(db, COLLECTIONS.INVOICES);

export function listenInvoices(userId, callback) {
  // Create a simpler query first to avoid index issues during development
  const q = query(
    invoicesCol,
    where(FIELDS.USER_ID, "==", userId)
    // Temporarily remove orderBy to test basic functionality
    // orderBy(FIELDS.CREATED_AT, QUERY_ORDER.DESC)
  );
  const unsub = onSnapshot(q, (snap) => {
    const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    // Sort in memory for now
    rows.sort((a, b) => new Date(b[FIELDS.CREATED_AT]?.toDate()) - new Date(a[FIELDS.CREATED_AT]?.toDate()));
    callback(rows);
  });
  return unsub;
}

export async function getInvoice(id) {
  const ref = doc(db, COLLECTIONS.INVOICES, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function createInvoice(data) {
  const payload = normalizeInvoiceForSave(data);
  const res = await addDoc(invoicesCol, payload);
  return res.id;
}

export async function updateInvoice(id, data) {
  const ref = doc(db, COLLECTIONS.INVOICES, id);
  const payload = normalizeInvoiceForSave(data, false);
  await updateDoc(ref, payload);
}

export async function deleteInvoice(id) {
  const ref = doc(db, COLLECTIONS.INVOICES, id);
  await deleteDoc(ref);
}

function normalizeInvoiceForSave(data, isCreate = true) {
  const safe = { ...data };
  // Convert date strings to Firestore Timestamp
  if (safe[FIELDS.CREATED_AT] && typeof safe[FIELDS.CREATED_AT] === "string") {
    safe[FIELDS.CREATED_AT] = Timestamp.fromDate(new Date(safe[FIELDS.CREATED_AT]));
  }
  if (safe[FIELDS.INVOICE_DUE_DATE] && typeof safe[FIELDS.INVOICE_DUE_DATE] === "string") {
    safe[FIELDS.INVOICE_DUE_DATE] = Timestamp.fromDate(new Date(safe[FIELDS.INVOICE_DUE_DATE]));
  }
  // Ensure numbers for totals
  safe[FIELDS.INVOICE_SUBTOTAL] = Number(safe[FIELDS.INVOICE_SUBTOTAL] || 0);
  safe[FIELDS.INVOICE_TAX] = Number(safe[FIELDS.INVOICE_TAX] || 0);
  safe[FIELDS.INVOICE_TOTAL] = Number(safe[FIELDS.INVOICE_TOTAL] || 0);
  // Items normalization
  safe[FIELDS.INVOICE_ITEMS] = Array.isArray(safe[FIELDS.INVOICE_ITEMS])
    ? safe[FIELDS.INVOICE_ITEMS].map((it) => ({
      description: it.description || "",
      qty: Number(it.qty || 0),
      price: Number(it.price || 0),
      amount: Number(it.amount || Number(it.qty || 0) * Number(it.price || 0)),
    }))
    : [];

  if (isCreate) {
    safe[FIELDS.CREATED_AT] = serverTimestamp();
  }

  return safe;
}
