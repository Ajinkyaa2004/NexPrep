"use client";
import { auth } from "../firebase/client";

/**
 * Returns a fresh Firebase ID token for the current user, or null when not
 * signed in. Pass the result to server actions so they can verify identity.
 * Waits briefly for auth state to resolve if it hasn't yet.
 */
export async function getIdToken() {
  let user = auth.currentUser;
  if (!user) {
    // Auth state may not be populated on the very first render — wait once.
    user = await new Promise((resolve) => {
      const unsub = auth.onAuthStateChanged((u) => {
        unsub();
        resolve(u);
      });
      setTimeout(() => resolve(auth.currentUser), 2500);
    });
  }
  if (!user) return null;
  try {
    return await user.getIdToken();
  } catch {
    return null;
  }
}
