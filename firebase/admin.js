import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

let cachedAuth = null;

/**
 * Lazily initialise the Firebase Admin SDK. Returns the admin Auth instance,
 * or null if credentials are not configured (so callers can decide how to
 * handle an unconfigured environment instead of crashing at import time).
 */
function getAdminAuth() {
  if (cachedAuth) return cachedAuth;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    console.warn("⚠️ Firebase Admin credentials are not set — server-side auth is disabled.");
    return null;
  }

  try {
    if (getApps().length === 0) {
      initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
    }
    cachedAuth = getAuth();
    return cachedAuth;
  } catch (e) {
    console.error("Firebase Admin init failed:", e.message);
    return null;
  }
}

/**
 * Verify a Firebase ID token and return the decoded identity.
 * Returns null when the token is missing/invalid or admin is not configured.
 */
export async function verifyAuthToken(idToken) {
  if (!idToken) return null;
  const adminAuth = getAdminAuth();
  if (!adminAuth) return null;
  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    return {
      uid: decoded.uid,
      email: decoded.email || null,
      name: decoded.name || null,
      emailVerified: decoded.email_verified,
    };
  } catch (e) {
    console.error("Token verification failed:", e.code || e.message);
    return null;
  }
}

export { getAdminAuth };
