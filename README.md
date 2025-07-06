# SignUp Worker

A secure Cloudflare Worker for handling user registration with comprehensive validation, security features, and backend integration.

## Features

- 🔒 **Secure Registration**: Password hashing and validation
- 🛡️ **Input Validation**: Comprehensive request validation
- 📧 **Email Validation**: Format and domain validation
- 🌐 **Backend Integration**: Secure communication with registration API
- 📊 **Error Handling**: Detailed error responses and logging
- 🚀 **CORS Support**: Proper cross-origin request handling
- 🛡️ **Rate Limiting**: Protection against spam registrations
- 🔐 **Password Strength**: Enforced password complexity
- ⚡ **High Performance**: Optimized for Cloudflare Edge

## Quick Setup

### 1. Set Your Backend URL

```bash
wrangler secret put BACKEND_URL
```

### 2. Set JWT Secret

```bash
wrangler secret put JWT_SECRET
```

### 3. Optional: Set Email Service Configuration

```bash
wrangler secret put EMAIL_SERVICE_API_KEY
```

### 4. Deploy

```bash
wrangler deploy
```

## API Endpoint

### POST /

Registers a new user account.

**Headers:**
- `Content-Type: application/json` (required)

**Request Body:**
```json
{
    "username": "newuser",
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "fullName": "John Doe"
}
```

**Response:**
- `201 Created`: Registration successful
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "user": {
      "id": "user123",
      "username": "newuser",
      "email": "user@example.com",
      "fullName": "John Doe"
    }
  }
  ```
- `400 Bad Request`: Invalid request format or validation errors
- `409 Conflict`: Username or email already exists
- `405 Method Not Allowed`: Non-POST request
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Backend error

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `BACKEND_URL` | Backend API endpoint for user registration | Yes |
| `JWT_SECRET` | Secret key for JWT token generation | Yes |
| `EMAIL_SERVICE_API_KEY` | API key for email verification service | Optional |

## Security Features

- Password strength validation (min 8 chars, uppercase, lowercase, number, special char)
- Email format and domain validation
- Username format validation
- Input sanitization and validation
- Rate limiting per IP address
- Secure backend communication
- Error message sanitization
- Request method validation
- CORS protection

## Validation Rules

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Username Requirements
- 3-30 characters
- Alphanumeric and underscores only
- Must start with a letter

### Email Requirements
- Valid email format
- Domain validation
- No disposable email domains

## Development

1. Copy `wrangler.toml.example` to `wrangler.toml`
2. Configure your environment variables
3. Test using `test.html`
4. Deploy with `wrangler deploy`

## Testing

Use the provided `test.html` file to test the worker functionality locally or after deployment.

## Rate Limiting

The worker includes built-in rate limiting to prevent abuse:
- Maximum 5 registration attempts per IP per hour
- Configurable limits via environment variables
- Automatic cleanup of expired rate limit data
