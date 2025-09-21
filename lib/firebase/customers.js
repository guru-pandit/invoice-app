import { db } from "@/lib/firebase/firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { COLLECTIONS, FIELDS, QUERY_ORDER } from "@/constants/collections";

const customersCol = collection(db, COLLECTIONS.CUSTOMERS);

export function listenCustomers(userId, callback) {
  const q = query(customersCol, where(FIELDS.USER_ID, "==", userId), orderBy(FIELDS.CREATED_AT, QUERY_ORDER.DESC));
  const unsub = onSnapshot(q, (snap) => {
    const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(rows);
  });
  return unsub;
}

export async function getCustomer(id) {
  const ref = doc(db, COLLECTIONS.CUSTOMERS, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function createCustomer(data) {
  const payload = {
    [FIELDS.CUSTOMER_NAME]: data.name || "",
    [FIELDS.CUSTOMER_EMAIL]: data.email || "",
    [FIELDS.CUSTOMER_PHONE]: data.phone || "",
    [FIELDS.USER_ID]: data.userId,
    [FIELDS.CREATED_AT]: serverTimestamp(),
  };
  const res = await addDoc(customersCol, payload);
  return res.id;
}

export async function updateCustomer(id, data) {
  const ref = doc(db, COLLECTIONS.CUSTOMERS, id);
  await updateDoc(ref, {
    [FIELDS.CUSTOMER_NAME]: data.name || "",
    [FIELDS.CUSTOMER_EMAIL]: data.email || "",
    [FIELDS.CUSTOMER_PHONE]: data.phone || "",
  });
}

export async function deleteCustomer(id) {
  const ref = doc(db, COLLECTIONS.CUSTOMERS, id);
  await deleteDoc(ref);
}
