import { db } from "@/lib/firebase/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

const customersCol = collection(db, "customers");

export function listenCustomers(userId, callback) {
  const q = query(customersCol, where("userId", "==", userId), orderBy("createdAt", "desc"));
  const unsub = onSnapshot(q, (snap) => {
    const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(rows);
  });
  return unsub;
}

export async function getCustomer(id) {
  const ref = doc(db, "customers", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function createCustomer(data) {
  const payload = {
    name: data.name || "",
    email: data.email || "",
    phone: data.phone || "",
    userId: data.userId,
    createdAt: serverTimestamp(),
  };
  const res = await addDoc(customersCol, payload);
  return res.id;
}

export async function updateCustomer(id, data) {
  const ref = doc(db, "customers", id);
  await updateDoc(ref, {
    name: data.name || "",
    email: data.email || "",
    phone: data.phone || "",
  });
}

export async function deleteCustomer(id) {
  const ref = doc(db, "customers", id);
  await deleteDoc(ref);
}
