# Security Policy

## Supported Versions

This portfolio website is continuously updated. Only the latest deployed version is actively supported.

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| Older   | :x:                |

## Reporting a Vulnerability

We take the security of this portfolio website seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Where to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via:

- **Email**: your.email@example.com
- **Security.txt**: See `.well-known/security.txt`
- **GitHub Security Advisories**: Use the "Security" tab in this repository

### What to Include

Please include the following information in your report:

- Type of vulnerability
- Full paths of source file(s) related to the manifestation of the vulnerability
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Updates**: Every 5 business days
- **Fix Timeline**: Depends on severity
  - Critical: 24-48 hours
  - High: 3-7 days
  - Medium: 7-14 days
  - Low: 14-30 days

## Vulnerability Severity

We classify vulnerabilities using the following severity levels:

### Critical
- Remote code execution
- SQL injection with data access
- Authentication bypass
- Exposure of sensitive credentials

### High
- XSS vulnerabilities
- CSRF on sensitive operations
- Insecure direct object references
- Significant data leakage

### Medium
- Information disclosure
- Denial of service
- CORS misconfigurations
- Missing security headers

### Low
- Minor information leakage
- Best practice violations
- Non-exploitable edge cases

## Disclosure Policy

When we receive a security bug report, we will:

1. Confirm the problem and determine the affected versions
2. Audit code to find any similar problems
3. Prepare fixes for all supported versions
4. Release patched versions as soon as possible

We ask that you:

- Give us reasonable time to fix the issue before public disclosure
- Make a good faith effort to avoid privacy violations, data destruction, and service interruption
- Do not exploit the vulnerability beyond what is necessary for verification

## Safe Harbor

We consider security research conducted under this policy to be:

- Authorized in accordance with applicable laws
- Conducted in good faith
- Exempt from restrictions that would otherwise prohibit security research

We will not pursue legal action against researchers who:

- Follow this disclosure policy
- Act in good faith
- Do not access or modify user data beyond what is necessary for verification
- Do not disrupt our services

## Bug Bounty

Currently, we do not offer a paid bug bounty program. However, we deeply appreciate security researchers who help us maintain a secure portfolio website.

Researchers who report valid vulnerabilities will be:

- Acknowledged in our security acknowledgments (if desired)
- Credited in release notes (if desired)
- Provided with updates on the fix timeline

## Security Best Practices Implemented

This portfolio website implements the following security measures:

### Headers
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

### Input Validation
- Client-side validation
- Server-side validation (for form submissions)
- Input sanitization
- Output encoding

### Protection Against Common Attacks
- XSS protection
- CSRF protection
- SQL injection prevention (if applicable)
- Clickjacking protection
- Bot detection (honeypot fields)

### Monitoring
- Security event logging
- Failed login attempt tracking
- Rate limiting on sensitive endpoints

## Known Limitations

- GitHub Pages has limited server-side security control
- Some security headers may not be fully supported by GitHub Pages
- Contact form requires client-side validation only (consider using a service like Formspree for production)

## Security Updates

We regularly:

- Update dependencies to patch known vulnerabilities
- Review and update security configurations
- Test for new vulnerability types
- Monitor security advisories for used libraries

## Contact

For security-related questions or concerns:

- Email: your.email@example.com
- Security.txt: `/.well-known/security.txt`

---

**Last Updated**: 2024-01-01

Thank you for helping keep this portfolio website secure!
