SignUp Worker - Secure User Registration System

This is a production-ready Cloudflare Worker designed for secure user registration with comprehensive validation, password strength requirements, and backend integration.

KEY FEATURES:
- Secure user registration with comprehensive validation
- Password strength enforcement with complexity requirements
- Email format and domain validation
- Username format validation and uniqueness checking
- Rate limiting to prevent spam registrations
- Backend API integration for user creation
- Comprehensive input validation and sanitization
- CORS protection with configurable origins
- Detailed error handling without information leakage
- Production-ready deployment configuration

SETUP REQUIREMENTS:
1. Cloudflare Workers account
2. Backend API endpoint for user registration
3. JWT secret for token generation
4. Email service integration (optional)
5. Wrangler CLI for deployment

QUICK START:
1. Copy wrangler.toml.example to wrangler.toml
2. Configure your backend URL: wrangler secret put BACKEND_URL
3. Set JWT secret: wrangler secret put JWT_SECRET
4. Optional: Set email service: wrangler secret put EMAIL_SERVICE_API_KEY
5. Deploy: wrangler deploy
6. Test using the included test.html file

SECURITY FEATURES:
- Password complexity requirements enforced (8+ chars, mixed case, numbers, special chars)
- Email format validation prevents invalid registrations
- Username format validation (3-30 chars, alphanumeric + underscore)
- Rate limiting per IP address prevents spam registrations
- Input validation and sanitization prevents injection attacks
- Error messages sanitized to prevent information disclosure
- Backend communication secured with proper authentication
- Request method validation (POST only)

VALIDATION RULES:
- Username: 3-30 characters, must start with letter, alphanumeric + underscore only
- Email: Valid email format with domain validation
- Password: Minimum 8 characters with uppercase, lowercase, number, and special character
- Full Name: Required field for user identification

This worker is part of a larger user management system and integrates with:
- LoginWorker (for post-registration authentication)
- ProfileInfoWorker (for profile data management)
- ForgotPassWorker (for password reset functionality)
- DeleteProfileWorker (for account management)

For detailed documentation, see README.md
For deployment guidance, see DEPLOYMENT_CHECKLIST.md
For security information, see SECURITY.md
