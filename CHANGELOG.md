# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-07-06

### Added
- Initial release of SignUp Worker
- Secure user signup endpoint with comprehensive validation
- Rate limiting with exponential backoff per user/IP
- Google reCAPTCHA integration for bot protection
- Comprehensive security headers (CSP, HSTS, XSS protection)
- CORS support for cross-origin requests
- Input validation and sanitization for email, password, and name
- KV-based storage for rate limiting data
- Development test HTML page with real-time validation
- Complete documentation and setup instructions

### Security Features
- Content Security Policy (CSP) implementation
- X-Frame-Options: DENY to prevent clickjacking
- X-Content-Type-Options: nosniff
- Strict Transport Security (HSTS) with preload
- X-XSS-Protection enabled
- Cache-Control: no-store for sensitive endpoints

### Rate Limiting
- Per-user (email) and per-IP tracking
- Exponential backoff algorithm
- Configurable windows and limits
- Automatic cleanup of expired entries
- KV storage for persistence across worker instances

### Input Validation
- RFC-compliant email validation
- Strong password requirements (8+ chars, letters + numbers)
- Name validation (2-50 chars, safe characters only)
- HTML entity sanitization
- Trimming and normalization

### Infrastructure
- Cloudflare Workers runtime
- KV namespace for rate limiting storage
- Environment variable configuration
- Wrangler tooling support
- Multiple environment support (dev/prod)

## [Unreleased]

### Planned
- Enhanced logging and monitoring
- Additional validation rules
- Webhook support for notifications
- Metrics collection
- Advanced CAPTCHA options
- Customizable rate limiting rules
