import { db } from "@/lib/firebase/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  where,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

const invoicesCol = collection(db, "invoices");

export function listenInvoices(userId, callback) {
  // Create a simpler query first to avoid index issues during development
  const q = query(
    invoicesCol,
    where("userId", "==", userId)
    // Temporarily remove orderBy to test basic functionality
    // orderBy("createdAt", "desc")
  );
  const unsub = onSnapshot(q, (snap) => {
    const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    // Sort in memory for now
    rows.sort((a, b) => new Date(b.createdAt?.toDate()) - new Date(a.createdAt?.toDate()));
    callback(rows);
  });
  return unsub;
}

export async function getInvoice(id) {
  const ref = doc(db, "invoices", id);
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
  const ref = doc(db, "invoices", id);
  const payload = normalizeInvoiceForSave(data, false);
  await updateDoc(ref, payload);
}

export async function deleteInvoice(id) {
  const ref = doc(db, "invoices", id);
  await deleteDoc(ref);
}

function normalizeInvoiceForSave(data, isCreate = true) {
  const safe = { ...data };
  // Convert date strings to Firestore Timestamp
  if (safe.createdAt && typeof safe.createdAt === "string") {
    safe.createdAt = Timestamp.fromDate(new Date(safe.createdAt));
  }
  if (safe.dueDate && typeof safe.dueDate === "string") {
    safe.dueDate = Timestamp.fromDate(new Date(safe.dueDate));
  }
  // Ensure numbers for totals
  safe.subtotal = Number(safe.subtotal || 0);
  safe.tax = Number(safe.tax || 0);
  safe.total = Number(safe.total || 0);
  // Items normalization
  safe.items = Array.isArray(safe.items)
    ? safe.items.map((it) => ({
        description: it.description || "",
        qty: Number(it.qty || 0),
        price: Number(it.price || 0),
        amount: Number(it.amount || Number(it.qty || 0) * Number(it.price || 0)),
      }))
    : [];

  if (isCreate) {
    safe.createdAt = serverTimestamp();
  }

  return safe;
}
