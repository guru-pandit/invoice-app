import { db } from "@/lib/firebase/firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { COLLECTIONS, FIELDS, QUERY_ORDER } from "@/constants/collections";

const customersCol = collection(db, COLLECTIONS.CUSTOMERS);

export function listenCustomers(userId, callback) {
  try {
    // Temporarily remove orderBy to avoid index issues
    const q = query(customersCol, where(FIELDS.USER_ID, "==", userId));
    // const q = query(customersCol, where(FIELDS.USER_ID, "==", userId), orderBy(FIELDS.CREATED_AT, QUERY_ORDER.DESC));

    const unsub = onSnapshot(q, (snap) => {
      console.log('Customers snapshot received:', snap.docs.length, 'documents');
      const rows = snap.docs.map((d) => {
        const data = d.data();
        console.log('Customer data:', d.id, data);
        return { id: d.id, ...data };
      });
      console.log('Processed customers:', rows);
      callback(rows);
    }, (error) => {
      console.error('Customers listener error:', error);
    });

    return unsub;
  } catch (error) {
    console.error('Failed to set up customers listener:', error);
    throw error;
  }
}

export async function getCustomer(id) {
  try {
    const ref = doc(db, COLLECTIONS.CUSTOMERS, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      console.log('Customer not found:', id);
      return null;
    }
    const data = snap.data();
    console.log('Retrieved customer:', id, data);
    return { id: snap.id, ...data };
  } catch (error) {
    console.error('Failed to get customer:', error);
    throw error;
  }
}

export async function createCustomer(data) {
  try {
    const payload = {
      [FIELDS.CUSTOMER_NAME]: data.name || "",
      [FIELDS.CUSTOMER_EMAIL]: data.email || "",
      [FIELDS.CUSTOMER_PHONE]: data.phone || "",
      [FIELDS.USER_ID]: data.userId,
      [FIELDS.CREATED_AT]: serverTimestamp(),
    };
    console.log('Creating customer with payload:', payload);
    const res = await addDoc(customersCol, payload);
    console.log('Customer created with ID:', res.id);
    return res.id;
  } catch (error) {
    console.error('Failed to create customer:', error);
    throw error;
  }
}

export async function updateCustomer(id, data) {
  try {
    const ref = doc(db, COLLECTIONS.CUSTOMERS, id);
    const updatePayload = {
      [FIELDS.CUSTOMER_NAME]: data.name || "",
      [FIELDS.CUSTOMER_EMAIL]: data.email || "",
      [FIELDS.CUSTOMER_PHONE]: data.phone || "",
    };
    console.log('Updating customer:', id, 'with payload:', updatePayload);
    await updateDoc(ref, updatePayload);
    console.log('Customer updated successfully:', id);
  } catch (error) {
    console.error('Failed to update customer:', error);
    throw error;
  }
}

export async function deleteCustomer(id) {
  try {
    const ref = doc(db, COLLECTIONS.CUSTOMERS, id);
    console.log('Deleting customer:', id);
    await deleteDoc(ref);
    console.log('Customer deleted successfully:', id);
  } catch (error) {
    console.error('Failed to delete customer:', error);
    throw error;
  }
}
