import { getAuth, signOut, setPersistence, browserLocalPersistence, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged } from "firebase/auth";
import { app } from "@/lib/firebase/firebase";
import { store } from "@/store/store";
import { logout, setUser } from "@/store/slices/authSlice";

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
  // Also clear Redux state
  store.dispatch(logout());
}

// Initialize auth state listener
// This function sets up the Firebase auth state listener and syncs with Redux
export function initializeAuthListener() {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    store.dispatch(setUser(user));
  });
  
  return unsubscribe;
}
