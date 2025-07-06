SIGNUP WORKER - QUICK SETUP GUIDE
=====================================

This is a Cloudflare Worker for secure user signup with rate limiting and CAPTCHA protection.

QUICK START:
-----------
1. Install Node.js 18+ and npm
2. Install Wrangler CLI: npm install -g wrangler
3. Clone this repository
4. Run: npm install
5. Copy wrangler.toml.example to wrangler.toml
6. Edit wrangler.toml with your account ID
7. Create KV namespace: wrangler kv:namespace create "RATE_LIMIT_KV"
8. Set secrets:
   - wrangler secret put BACKEND_URL
   - wrangler secret put RECAPTCHA_SECRET
9. Deploy: npm run deploy

DEVELOPMENT:
-----------
- Start dev server: npm run dev
- Test with: test.html (open in browser)
- Default dev URL: http://localhost:8787

REQUIRED SETUP:
--------------
✓ Cloudflare account with Workers enabled
✓ Backend endpoint that accepts POST requests with JSON
✓ Google reCAPTCHA keys (site key and secret key)
✓ KV namespace for rate limiting storage

ENVIRONMENT VARIABLES:
---------------------
BACKEND_URL - Your signup backend endpoint
RECAPTCHA_SECRET - Your Google reCAPTCHA secret key

SECURITY FEATURES:
-----------------
✓ Rate limiting (exponential backoff)
✓ Google reCAPTCHA verification
✓ Input validation and sanitization
✓ Security headers (CSP, HSTS, etc.)
✓ CORS protection

API ENDPOINT:
------------
POST / 
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe",
  "captcha": "recaptcha-response-token"
}

For detailed setup instructions, see README.md
