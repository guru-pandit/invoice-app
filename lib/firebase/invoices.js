import { db } from "@/lib/firebase/firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, where, query, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import { COLLECTIONS, FIELDS, QUERY_ORDER } from "@/constants/collections";

const invoicesCol = collection(db, COLLECTIONS.INVOICES);

export function listenInvoices(userId, callback) {
  try {
    // Create a simpler query first to avoid index issues during development
    const q = query(
      invoicesCol,
      where(FIELDS.USER_ID, "==", userId)
      // Temporarily remove orderBy to test basic functionality
      // orderBy(FIELDS.CREATED_AT, QUERY_ORDER.DESC)
    );

    const unsub = onSnapshot(q, (snap) => {
      console.log('Invoices snapshot received:', snap.docs.length, 'documents');
      const rows = snap.docs.map((d) => {
        const data = d.data();
        console.log('Invoice data:', d.id, data);
        return { id: d.id, ...data };
      });
      // Sort in memory for now
      const sortedRows = rows.sort((a, b) => {
        const dateA = a[FIELDS.CREATED_AT]?.toDate ? a[FIELDS.CREATED_AT].toDate() : new Date(a[FIELDS.CREATED_AT]);
        const dateB = b[FIELDS.CREATED_AT]?.toDate ? b[FIELDS.CREATED_AT].toDate() : new Date(b[FIELDS.CREATED_AT]);
        return dateB - dateA;
      });
      console.log('Processed invoices:', sortedRows);
      callback(sortedRows);
    }, (error) => {
      console.error('Invoices listener error:', error);
    });

    return unsub;
  } catch (error) {
    console.error('Failed to set up invoices listener:', error);
    throw error;
  }
}

export async function getInvoice(id) {
  try {
    const ref = doc(db, COLLECTIONS.INVOICES, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      console.log('Invoice not found:', id);
      return null;
    }
    const data = snap.data();
    console.log('Retrieved invoice:', id, data);
    return { id: snap.id, ...data };
  } catch (error) {
    console.error('Failed to get invoice:', error);
    throw error;
  }
}

export async function createInvoice(data) {
  try {
    const payload = normalizeInvoiceForSave(data);
    console.log('Creating invoice with payload:', payload);
    const res = await addDoc(invoicesCol, payload);
    console.log('Invoice created with ID:', res.id);
    return res.id;
  } catch (error) {
    console.error('Failed to create invoice:', error);
    throw error;
  }
}

export async function updateInvoice(id, data) {
  try {
    const ref = doc(db, COLLECTIONS.INVOICES, id);
    const payload = normalizeInvoiceForSave(data, false);
    console.log('Updating invoice:', id, 'with payload:', payload);
    await updateDoc(ref, payload);
    console.log('Invoice updated successfully:', id);
  } catch (error) {
    console.error('Failed to update invoice:', error);
    throw error;
  }
}

export async function deleteInvoice(id) {
  try {
    const ref = doc(db, COLLECTIONS.INVOICES, id);
    console.log('Deleting invoice:', id);
    await deleteDoc(ref);
    console.log('Invoice deleted successfully:', id);
  } catch (error) {
    console.error('Failed to delete invoice:', error);
    throw error;
  }
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
