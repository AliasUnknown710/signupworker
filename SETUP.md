# Setup Guide

This guide provides detailed setup instructions for the SignUp Worker Cloudflare Worker template.

## Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn** package manager
- **Cloudflare account** (free tier works)
- **Wrangler CLI** (will be installed with dependencies)
- **KV namespace** for storing user data
- **Backend service** for user registration processing

## Step-by-Step Setup

### 1. Project Setup

#### Clone the Repository
```bash
git clone <your-repository-url>
cd SignUpWorker
```

#### Install Dependencies
```bash
npm install
```

This will install:
- Wrangler CLI for Cloudflare Workers
- TypeScript definitions
- Development tools (ESLint, Prettier)

### 2. Cloudflare Configuration

#### Login to Cloudflare
```bash
npx wrangler login
```

This will open your browser for authentication.

#### Verify Authentication
```bash
npx wrangler whoami
```

### 3. Environment Configuration

#### Create Configuration File
```bash
# Windows
copy wrangler.toml.example wrangler.toml

# macOS/Linux
cp wrangler.toml.example wrangler.toml
```

#### Edit wrangler.toml
```toml
name = "signup-worker"
main = "index.js"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

# KV namespace for user data
[[kv_namespaces]]
binding = "USERS_KV"
id = "your-kv-namespace-id"

# Optional: Custom domain configuration
# [[routes]]
# pattern = "signup.yourdomain.com/*"
# zone_name = "yourdomain.com"
```

### 4. KV Namespace Setup

#### Create KV Namespace
```bash
npx wrangler kv:namespace create "USERS_KV"
```

This will return a namespace ID. Copy it to your `wrangler.toml` file.

#### Verify KV Namespace
```bash
npx wrangler kv:namespace list
```

### 5. Environment Variables

#### Set Backend URL (Required)
```bash
npx wrangler secret put BACKEND_SIGNUP_URL
```

When prompted, enter your backend signup endpoint:
```
https://api.yourapp.com/auth/signup
```

#### Set reCAPTCHA Secret (if using CAPTCHA)
```bash
npx wrangler secret put RECAPTCHA_SECRET_KEY
```

#### Set Email Service API Key (if using email verification)
```bash
npx wrangler secret put EMAIL_API_KEY
```

#### Verify Secrets
```bash
npx wrangler secret list
```

### 6. Backend Service Requirements

Your backend signup endpoint must:

#### Accept POST Requests
```javascript
// Expected request format
{
  "email": "user@example.com",
  "username": "username",
  "password": "securepassword",
  "captchaToken": "recaptcha-token" // if using CAPTCHA
}
```

#### Return JSON Response
```javascript
// Success response (HTTP 201)
{
  "success": true,
  "userId": "user-id",
  "message": "Account created successfully",
  "requiresVerification": true // if email verification needed
}

// Failure response (HTTP 400)
{
  "success": false,
  "message": "Email already exists",
  "errors": {
    "email": "Email address is already registered"
  }
}

// Server error (HTTP 500)
{
  "success": false,
  "message": "Internal server error"
}
```

#### Example Backend Implementation (Node.js/Express)
```javascript
app.post('/auth/signup', async (req, res) => {
  const { email, username, password, captchaToken } = req.body;
  
  try {
    // Validate CAPTCHA if enabled
    if (captchaToken) {
      const captchaValid = await validateRecaptcha(captchaToken);
      if (!captchaValid) {
        return res.status(400).json({
          success: false,
          message: "CAPTCHA validation failed"
        });
      }
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    // Create new user
    const user = await createUser({ email, username, password });
    
    // Send verification email if needed
    if (user.requiresVerification) {
      await sendVerificationEmail(user.email, user.verificationToken);
    }

    res.status(201).json({
      success: true,
      userId: user.id,
      message: "Account created successfully",
      requiresVerification: user.requiresVerification
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});
```

### 7. Development and Testing

#### Start Development Server
```bash
npm run dev
```

This will start the local development server at `http://localhost:8787`

#### Test the API

**Test Basic Information:**
```bash
curl http://localhost:8787/
```

**Test Signup Endpoint:**
```bash
curl -X POST http://localhost:8787/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "SecurePass123!"
  }'
```

**Test Rate Limiting:**
```bash
# Make multiple requests quickly to test rate limiting
for i in {1..10}; do
  curl -X POST http://localhost:8787/signup \
    -H "Content-Type: application/json" \
    -d '{
      "email": "test'$i'@example.com",
      "username": "testuser'$i'",
      "password": "SecurePass123!"
    }'
done
```

### 8. Deployment

#### Deploy to Cloudflare
```bash
npm run deploy
```

#### Verify Deployment
```bash
npx wrangler tail --format pretty
```

### 9. Custom Domain Setup (Optional)

#### Add Custom Domain in wrangler.toml
```toml
[[routes]]
pattern = "signup.yourdomain.com/*"
zone_name = "yourdomain.com"
```

#### Deploy with Custom Domain
```bash
npm run deploy
```

## Configuration Options

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `BACKEND_SIGNUP_URL` | Yes | Backend signup endpoint URL |
| `RECAPTCHA_SECRET_KEY` | No | Google reCAPTCHA secret key |
| `EMAIL_API_KEY` | No | Email service API key |

### KV Namespace Configuration

| Setting | Required | Description |
|---------|----------|-------------|
| `USERS_KV` | Yes | KV namespace for user data |

### Rate Limiting Configuration

```javascript
// Default rate limiting settings (configurable in code)
const rateLimits = {
  signup: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000 // 15 minutes
  },
  global: {
    maxAttempts: 100,
    windowMs: 15 * 60 * 1000 // 15 minutes
  }
};
```

## Troubleshooting

### Common Issues

#### Signup Failed
- Verify backend service is running and accessible
- Check request format matches expected schema
- Ensure all required fields are provided

#### Rate Limiting Issues
- Check if too many requests from same IP
- Verify rate limiting configuration
- Consider implementing user-specific rate limiting

#### CAPTCHA Validation Failed
- Verify reCAPTCHA secret key is correct
- Check if CAPTCHA token is valid and not expired
- Ensure frontend sends valid CAPTCHA response

#### KV Store Errors
- Verify KV namespace is created and bound
- Check KV namespace permissions
- Ensure proper error handling for KV operations

### Debugging

#### Enable Debug Mode
```bash
# Local development with verbose logging
npx wrangler dev --local --log-level debug
```

#### Check Logs
```bash
# View real-time logs
npx wrangler tail --format pretty

# View logs for specific deployment
npx wrangler tail --env production
```

#### KV Store Debugging
```bash
# List KV keys
npx wrangler kv:key list --binding USERS_KV

# Get KV value
npx wrangler kv:key get "key-name" --binding USERS_KV
```

## Security Considerations

### Input Validation

- **Email validation**: Verify email format and domain
- **Password strength**: Enforce minimum requirements
- **Username validation**: Check for appropriate characters
- **CAPTCHA verification**: Prevent automated abuse

### Rate Limiting

- **IP-based limiting**: Prevent abuse from single IP
- **Email-based limiting**: Prevent multiple accounts per email
- **Global rate limiting**: Protect against DDoS attacks

### Data Protection

- **Password hashing**: Never store plain text passwords
- **Data encryption**: Encrypt sensitive data in KV store
- **HTTPS only**: Force HTTPS for all communications
- **CORS configuration**: Restrict cross-origin requests

## Next Steps

After successful setup:

1. **Implement email verification** - Add email verification workflow
2. **Add monitoring** - Set up error tracking and performance monitoring
3. **Customize validation** - Add domain-specific validation rules
4. **Enhance security** - Implement additional security measures
5. **Add tests** - Write comprehensive tests for signup flow
6. **Documentation** - Update API documentation as needed

## Development Workflow

### Daily Development

```bash
# Start development
npm run dev

# In another terminal, tail logs
npx wrangler tail --local

# Make changes to your code
# The dev server will automatically reload
```

### Before Deployment

```bash
# Run tests
npm test

# Check code style
npm run lint

# Format code
npm run format

# Deploy
npm run deploy
```

### Environment Management

- **Development**: Use `npm run dev` with local environment
- **Staging**: Deploy with staging configuration
- **Production**: Deploy with production secrets and configuration

## Integration Examples

### Frontend Integration (JavaScript)

```javascript
// Basic signup form submission
async function signup(email, username, password, captchaToken) {
  try {
    const response = await fetch('https://signup.yourdomain.com/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        username,
        password,
        captchaToken
      })
    });

    const result = await response.json();
    
    if (result.success) {
      // Handle successful signup
      if (result.requiresVerification) {
        showMessage('Please check your email for verification');
      } else {
        showMessage('Account created successfully');
      }
    } else {
      // Handle signup errors
      showError(result.message);
    }
  } catch (error) {
    showError('Network error, please try again');
  }
}
```

### React Integration

```jsx
import React, { useState } from 'react';

function SignupForm() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      // Handle result
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

For detailed security information, see [SECURITY.md](SECURITY.md).
