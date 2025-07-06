# Contributing to SignUp Worker

Thank you for your interest in contributing to the SignUp Worker! This document provides guidelines for contributing to this Cloudflare Worker project.

## Project Overview

This worker is part of a larger authentication and user management system built on Cloudflare Workers. It handles secure user registration with comprehensive validation, password strength enforcement, and backend integration.

## Development Setup

### Prerequisites

- Node.js (v18 or later)
- Wrangler CLI
- Access to Cloudflare Workers
- Backend API for user registration
- Email service integration (optional)

### Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy configuration: `cp wrangler.toml.example wrangler.toml`
4. Configure your environment variables
5. Set up secrets: `wrangler secret put BACKEND_URL`
6. Set JWT secret: `wrangler secret put JWT_SECRET`

## Code Style and Standards

### Security Requirements

- Always validate and sanitize all user inputs
- Implement comprehensive password strength validation
- Use proper email format and domain validation
- Implement rate limiting to prevent spam registrations
- Use proper error handling without information leakage
- Implement proper CORS configuration
- Follow the principle of least privilege

### Validation Requirements

- Username: 3-30 characters, alphanumeric + underscore, must start with letter
- Email: Valid format with domain validation, prevent disposable emails
- Password: Minimum 8 chars with uppercase, lowercase, number, special character
- Full Name: Required field with length validation
- All inputs must be sanitized to prevent injection attacks

## Testing

### Test Cases to Cover

- Valid user registration requests
- Invalid username formats and duplicates
- Invalid email formats and duplicates
- Weak passwords failing strength requirements
- Rate limiting scenarios
- Backend service failures
- CORS preflight requests
- Malformed request data

## Security Considerations

### Input Validation

- Validate all registration data before processing
- Implement proper password complexity requirements
- Prevent email enumeration attacks
- Use consistent response times regardless of validation results
- Sanitize all inputs to prevent injection attacks

### Rate Limiting

- Implement per-IP rate limiting for registration requests
- Consider per-email rate limiting to prevent abuse
- Use appropriate time windows for rate limiting
- Handle rate limit bypass attempts
- Log suspicious registration patterns

### Data Protection

- Never log passwords or sensitive information
- Hash passwords securely before sending to backend
- Use HTTPS for all communications
- Implement proper error handling without information leakage
- Validate all backend responses before processing

## Integration

Works seamlessly with:
- LoginWorker (for post-registration authentication)
- ProfileInfoWorker (for profile data management)
- ForgotPassWorker (for password reset functionality)
- Backend user management systems
