# SignUp Worker

A secure Cloudflare Worker for handling user signup with advanced security features including rate limiting, CAPTCHA verification, input validation, and sanitization.

## Features

- 🔒 **Security Headers**: Comprehensive security headers including CSP, XSS protection, and HSTS
- 🛡️ **Rate Limiting**: Per-user/IP exponential backoff rate limiting using KV storage
- 🤖 **CAPTCHA Protection**: Google reCAPTCHA v2/v3 verification
- ✅ **Input Validation**: Email, password, and name validation with sanitization
- 🌐 **CORS Support**: Configurable CORS headers for cross-origin requests
- 📊 **Error Handling**: Comprehensive error handling and logging

## Security Features

### Rate Limiting
- Exponential backoff algorithm
- Per-user (email) and per-IP tracking
- Configurable limits and windows
- Automatic cleanup of expired entries

### Input Validation
- **Email**: RFC-compliant email validation
- **Password**: Minimum 8 characters with letters and numbers
- **Name**: 2-50 characters, letters, spaces, hyphens, and apostrophes only
- **Sanitization**: Removes dangerous characters and trims whitespace

### Security Headers
- Content Security Policy (CSP)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict Transport Security (HSTS)
- X-XSS-Protection
- Cache-Control: no-store

## Prerequisites

- Cloudflare account with Workers enabled
- Node.js 18+ and npm
- Wrangler CLI tool

## Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd SignUpWorker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure wrangler.toml**:
   ```bash
   cp wrangler.toml.example wrangler.toml
   ```
   Edit `wrangler.toml` with your worker name and account details.

4. **Set up environment variables**:
   ```bash
   # Set your backend URL
   wrangler secret put BACKEND_URL
   
   # Set your reCAPTCHA secret key
   wrangler secret put RECAPTCHA_SECRET
   ```

5. **Create KV namespace for rate limiting**:
   ```bash
   wrangler kv:namespace create "RATE_LIMIT_KV"
   ```
   Update your `wrangler.toml` with the namespace ID.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `BACKEND_URL` | URL of your backend signup endpoint | Yes |
| `RECAPTCHA_SECRET` | Google reCAPTCHA secret key | Yes |

## KV Namespaces

| Namespace | Purpose | Required |
|-----------|---------|----------|
| `RATE_LIMIT_KV` | Stores rate limiting data | Yes |

## API Endpoint

### POST /

Handles user signup requests.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe",
  "captcha": "03AGdBq25..."
}
```

**Responses**:
- `200`: Signup successful
- `400`: Invalid input (email, password, or name)
- `403`: CAPTCHA verification failed
- `405`: Method not allowed
- `429`: Rate limit exceeded
- `500`: Server error
- `502`: Backend error

## Development

1. **Start development server**:
   ```bash
   npm run dev
   ```

2. **Test the endpoint**:
   Open `test.html` in your browser to test the signup form.

3. **Deploy to production**:
   ```bash
   npm run deploy
   ```

## Configuration

### CORS Settings
Update the `corsHeaders` in `index.js` to match your frontend domain:

```javascript
const corsHeaders = {
    "Access-Control-Allow-Origin": "https://yourdomain.com",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
};
```

### Rate Limiting Settings
Adjust rate limiting parameters in the `isRateLimited` function:

```javascript
const baseWindow = 60 * 1000; // 1 minute
const maxAttempts = 5;
const maxBackoff = 60 * 60 * 1000; // 1 hour
```

## Testing

The project includes a simple HTML test page (`test.html`) that demonstrates the signup functionality with a working form and CAPTCHA integration.

## Security Considerations

- Always use HTTPS in production
- Regularly rotate your reCAPTCHA keys
- Monitor rate limiting metrics
- Keep dependencies updated
- Review and adjust security headers as needed
- Implement proper logging and monitoring

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.

## Support

For issues and questions:
- Create an issue in the GitHub repository
- Check the documentation and examples
- Review Cloudflare Workers documentation
