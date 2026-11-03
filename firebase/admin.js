import { createRemoteJWKSet, jwtVerify } from "jose";

// Firebase ID tokens are RS256 JWTs signed by Google's securetoken service.
// Verifying them with jose keeps the Worker bundle small (firebase-admin alone
// pushes it past the Cloudflare free-plan size limit).
const JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
);

/**
 * Verify a Firebase ID token and return the decoded identity.
 * Returns null when the token is missing/invalid or the project is not configured.
 */
export async function verifyAuthToken(idToken) {
  if (!idToken) return null;
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) {
    console.warn("⚠️ FIREBASE_PROJECT_ID is not set — server-side auth is disabled.");
    return null;
  }
  try {
    const { payload } = await jwtVerify(idToken, JWKS, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
      algorithms: ["RS256"],
    });
    if (!payload.sub) return null;
    return {
      uid: payload.sub,
      email: payload.email || null,
      name: payload.name || null,
      emailVerified: payload.email_verified,
    };
  } catch (e) {
    console.error("Token verification failed:", e.code || e.message);
    return null;
  }
}
