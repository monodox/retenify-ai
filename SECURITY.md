# Security Policy

## Supported Versions

We actively support the following versions of Retenify AI:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability in Retenify AI, please report it to us as described below.

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: **security@retenify.ai**

Include the following information in your report:
- Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue

### Response Timeline

- We will acknowledge receipt of your vulnerability report within 48 hours
- We will provide a detailed response within 7 days indicating next steps
- We will keep you informed of our progress throughout the process
- We will notify you when the vulnerability is fixed

### Disclosure Policy

- We ask that you give us reasonable time to investigate and fix the issue before public disclosure
- We will coordinate with you on the timing of public disclosure
- We will credit you in our security advisory (unless you prefer to remain anonymous)

## Security Best Practices

When using Retenify AI:

1. **Environment Variables**: Never commit API keys or secrets to version control
2. **Authentication**: Use strong passwords and enable 2FA where available
3. **Updates**: Keep dependencies and the platform updated to the latest versions
4. **Access Control**: Implement proper role-based access controls
5. **Data Protection**: Ensure sensitive business data is properly encrypted

## Security Features

Retenify AI includes several built-in security features:

- Input validation and sanitization
- Rate limiting on API endpoints
- Secure session management
- HTTPS enforcement
- CSRF protection
- XSS protection headers

## Contact

For any security-related questions or concerns, contact us at:
- Email: security@retenify.ai
- For general inquiries: support@retenify.ai