import { apiClient } from "./config"

// ---- Google sign-in -------------------------------------------------------
// The Google flow is a full-page redirect to the backend (not an XHR), so it
// must target the SAME backend every other API call uses: derive it from the
// apiClient base URL (VITE_BASE_URL) instead of hard-coding a hostname.
// Resolve against the page origin too, so a relative VITE_BASE_URL like "/api"
// (e.g. behind a dev proxy) still produces an absolute URL.
const apiBase = new URL(
    apiClient.defaults.baseURL.endsWith("/") ? apiClient.defaults.baseURL : apiClient.defaults.baseURL + "/",
    window.location.origin
)

export const getGoogleAuthUrl = (role = "user") => {
    const url = new URL("auth/google", apiBase)
    // Account type chosen on the page ('user' | 'vendor'); only honoured for brand-new accounts.
    url.searchParams.set("role", role)
    // Tell the backend which frontend started the flow so it can send us back
    // here (localhost vs. production) instead of always to FRONTEND_URL.
    url.searchParams.set("origin", window.location.origin)
    return url.toString()
}

export const startGoogleSignIn = (role) => {
    window.location.assign(getGoogleAuthUrl(role))
}

// Human-readable messages for the ?reason= code the backend appends when
// Google sign-in fails (see routes/auth.js in the backend).
const GOOGLE_ERROR_MESSAGES = {
    access_denied: "Google sign-in was cancelled, or this Google account is not allowed to use the app yet.",
    no_email: "Google did not share an email address for that account.",
    email_not_verified: "That Google account's email address is not verified, so it cannot be used to sign in.",
    email_linked_elsewhere: "That email is already linked to a different Google account.",
    state_missing: "Your sign-in link expired or was incomplete. Try again.",
    state_invalid: "Your sign-in link expired or was incomplete. Try again.",
    state_expired: "Your sign-in took too long and the link expired. Try again.",
    state_mismatch: "Finish signing in from the same browser you started in, with cookies enabled, and try again.",
    invalid_client: "The server's Google credentials are wrong (check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET).",
    redirect_uri_mismatch: "The server's callback URL is not registered in Google Cloud Console.",
    invalid_grant: "That sign-in link was already used or has expired. Try again.",
}

// Only ever display known codes: the ?reason= value comes from the URL and
// must not be echoed verbatim into the page.
export const googleErrorMessage = (reason) => {
    const known = Object.prototype.hasOwnProperty.call(GOOGLE_ERROR_MESSAGES, reason)
    const base = known ? GOOGLE_ERROR_MESSAGES[reason] : "Google sign-in failed. Try again."
    return base + " (code: " + (known ? reason : "unknown") + ")"
}

// ---- Email and password ---------------------------------------------------
export const apiSignup = async (payload) => {
    return await apiClient.post("/users/register", payload )
}

// Creates an operations account. The server rejects the request unless the
// x-admin-secret header matches its ADMIN_SECRET.
export const apiCreateAdmin = async (payload, secret) => {
    return apiClient.post("/users/admin", payload, {
        headers: { 'x-admin-secret': secret }
    })
}

export const apiLogin = async (payload) =>
   apiClient.post("/users/login", payload )
