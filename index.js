import { handleSignup } from './signupworker.js';

// Security headers
const securityHeaders = {
    "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none';",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
    "X-XSS-Protection": "1; mode=block",
    "Cache-Control": "no-store"
};

// CORS headers (adjust origin as needed)
const corsHeaders = {
    "Access-Control-Allow-Origin": "https://infosecbyalex.xyz",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
};

function withSecurityHeaders(response) {
    const headers = new Headers(response.headers);
    for (const [k, v] of Object.entries(securityHeaders)) headers.set(k, v);
    for (const [k, v] of Object.entries(corsHeaders)) headers.set(k, v);
    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers
    });
}

// Per-user/IP exponential backoff rate limiting
async function isRateLimited(request, env) {
    let identifier = request.headers.get("CF-Connecting-IP") || "unknown";
    let email = null;

    // Try to extract email from request body
    try {
        const clone = request.clone();
        const body = await clone.json();
        if (body && typeof body.email === "string") {
            email = body.email.trim().toLowerCase();
        }
    } catch { /* ignore */ }

    if (email) {
        identifier = `email:${email}`;
    } else {
        identifier = `ip:${identifier}`;
    }

    const key = `rl:${identifier}`;
    const data = await env.RATE_LIMIT_KV.get(key, { type: "json" });
    const now = Date.now();

    // Settings
    const baseWindow = 60 * 1000; // 1 minute
    const maxAttempts = 5;
    const maxBackoff = 60 * 60 * 1000; // 1 hour

    let attempts = 0;
    let firstAttempt = now;
    let backoff = 0;

    if (data && typeof data === "object") {
        attempts = data.attempts || 0;
        firstAttempt = data.firstAttempt || now;
        backoff = data.backoff || 0;

        // If still in backoff window, block
        if (data.blockUntil && now < data.blockUntil) {
            return true;
        }

        // If window expired, reset
        if (now - firstAttempt > baseWindow) {
            attempts = 0;
            firstAttempt = now;
            backoff = 0;
        }
    }

    attempts += 1;

    // If over limit, set exponential backoff
    if (attempts > maxAttempts) {
        backoff = backoff ? Math.min(backoff * 2, maxBackoff) : baseWindow;
        const blockUntil = now + backoff;
        await env.RATE_LIMIT_KV.put(key, JSON.stringify({
            attempts,
            firstAttempt,
            backoff,
            blockUntil
        }), { expirationTtl: Math.ceil((blockUntil - now) / 1000) + 10 });
        return true;
    } else {
        // Not over limit, update attempts
        await env.RATE_LIMIT_KV.put(key, JSON.stringify({
            attempts,
            firstAttempt,
            backoff
        }), { expirationTtl: Math.ceil((baseWindow - (now - firstAttempt)) / 1000) + 10 });
        return false;
    }
}

// Google reCAPTCHA verification
async function verifyCaptcha(token, secret, remoteip) {
    if (!token) return false;
    const params = new URLSearchParams();
    params.append('response', token);
    params.append('secret', secret);
    if (remoteip) params.append('remoteip', remoteip);

    const resp = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        body: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    const data = await resp.json();
    return !!data.success;
}

export default {
    async fetch(request, env, ctx) {
        // Handle preflight CORS
        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: { ...securityHeaders, ...corsHeaders } });
        }
        if (request.method !== 'POST') {
            return withSecurityHeaders(new Response('Method Not Allowed', { status: 405 }));
        }

        // Per-user/IP exponential backoff rate limiting
        if (await isRateLimited(request, env)) {
            return withSecurityHeaders(new Response('Too Many Requests. Please try again later.', { status: 429 }));
        }

        // reCAPTCHA verification
        let captchaToken = null;
        let remoteip = request.headers.get("CF-Connecting-IP") || "";
        try {
            const clone = request.clone();
            const body = await clone.json();
            captchaToken = body['captcha'] || body['captcha_token'] || body['g-recaptcha-response'];
        } catch { /* ignore */ }

        if (!await verifyCaptcha(captchaToken, env.RECAPTCHA_SECRET, remoteip)) {
            return withSecurityHeaders(new Response('CAPTCHA verification failed', { status: 403 }));
        }

        const response = await handleSignup(request, env);
        return withSecurityHeaders(response);
    }
};