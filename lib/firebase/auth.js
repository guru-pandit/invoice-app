import { getAuth, signOut, setPersistence, browserLocalPersistence, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { app } from "@/lib/firebase/firebase";

export const auth = getAuth(app);
// Ensure auth state persists across reloads
setPersistence(auth, browserLocalPersistence);

export async function emailSignIn(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function emailRegister(email, password) {
  return await createUserWithEmailAndPassword(auth, email, password);
}

export async function sendPasswordReset(email) {
  return await sendPasswordResetEmail(auth, email);
}

export async function signOutUser() {
  await signOut(auth);
}
