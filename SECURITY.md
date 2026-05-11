# Security Hardening Notes

This project is hardened at the frontend/static-hosting layer.

## Included hardening

- Strict security headers for static hosting:
  - Netlify: [`public/_headers`](./public/_headers)
  - Vercel: [`vercel.json`](./vercel.json)
- Strong CSP with allowlist-by-default (`default-src 'self'`).
- Clickjacking protection (`X-Frame-Options: DENY`, `frame-ancestors 'none'`).
- MIME sniffing protection (`X-Content-Type-Options: nosniff`).
- Strict referrer policy.
- Permissions policy disabling sensitive browser APIs.
- HSTS for HTTPS deployments.
- Security contact disclosure:
  - [`public/.well-known/security.txt`](./public/.well-known/security.txt)

## Operational recommendations

- Set `VITE_SITE_URL` to your production domain in environment variables.
- Keep dependencies updated and run:
  - `npm run audit:prod`
- If you add external scripts/fonts/APIs later, update CSP allowlists explicitly.
- If you add a backend, add:
  - server-side input validation
  - authentication/rate limiting
  - CSRF and abuse protections
  - centralized logging/alerting

## Important

Frontend hardening reduces risk but does not replace backend and infrastructure security controls.
