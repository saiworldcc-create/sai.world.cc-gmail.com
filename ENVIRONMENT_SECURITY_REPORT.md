# Enterprise Environment Security & Hardening Report
**Project:** Sai International Couriers & Cargo  
**Architecture:** Multi-Portal Logistics Platform (React 18 + Node.js Express + MongoDB Atlas + Capacitor Android)  
**Security Standard:** OWASP Top 10 API Security Compliance & Enterprise DevOps Hardening  
**Audit Date:** November 2026  
**Status:** AUDITED & SECURED  

---

## 1. Executive Summary

This security audit and hardening report documents the enterprise secret management, authentication hygiene, transport encryption, and environment isolation policies for the Sai International Couriers & Cargo ecosystem. 

All sensitive production secrets have been segregated from client-side bundles and source control. An automated environment validation layer (`backend/src/config/env.js` and `validate_environment.js`) enforces secret integrity at boot time.

---

## 2. Secret Management & Storage Architecture

### 2.1 Principle of Least Privilege Separation
| Tier | Secret Storage Mechanism | Exposure Risk | Permitted Variables |
| :--- | :--- | :--- | :--- |
| **Backend API (`/backend`)** | Server-side `.env` loaded via Node `dotenv` & validated by `env.js` | Zero client exposure | DB URIs, JWT Secrets, API Keys, Payment Gateway Secrets, SMTP credentials |
| **Frontend Web (`/frontend`)** | Bundled by Vite at build time via `import.meta.env` | Publicly inspectable in browser DOM/JS bundle | Non-sensitive public endpoints & public client keys (`VITE_API_URL`, `VITE_RAZORPAY_KEY_ID`, `VITE_GOOGLE_CLIENT_ID`) |
| **Android Mobile (`/frontend/android`)** | Native assets (`capacitor.config.json`) & compiled bytecode | Decompilable via APK analysis | Public API Gateway URLs only (`10.0.2.2` emulator loopback, LAN dev, or TLS production endpoint) |

### 2.2 Strict Rule Against Bundling Secrets
- **Zero Private Keys in Frontend:** No backend JWT secrets, database connection strings, Stripe secret keys, Razorpay secret keys, or ImageKit private keys are ever prefixed with `VITE_` or referenced in frontend code.
- **Git Ignore Enforcement:** Git ignores all `.env`, `.env.local`, `.env.development`, `.env.staging`, and `.env.production` files across the project root, `backend/`, and `frontend/`. Only sanitized `.example` templates are tracked.

---

## 3. CORS & Network Origin Policies

The backend uses configurable CORS middleware (`cors` package) integrated in `backend/src/server.js`:

```javascript
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, Postman, server-to-server) or matched origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
```

### Environment Policies:
- **Development:** `http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173`
- **Staging:** `https://staging.saicouriers.com,https://admin-staging.saicouriers.com`
- **Production:** `https://saicouriers.com,https://www.saicouriers.com,https://admin.saicouriers.com`
- **Capacitor Mobile:** Android WebView origins (`http://localhost`, `capacitor://localhost`, or direct native HTTP via Capacitor HTTP plugin) are permitted without CORS friction.

---

## 4. HTTPS / TLS Termination & Transport Security

- **Reverse Proxy / Edge TLS:** In staging and production, TLS 1.3 is enforced at the Cloudflare / Nginx / Render / AWS ALB edge before proxying to the Node.js backend.
- **HSTS (HTTP Strict Transport Security):** Enforce `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`.
- **Security Headers (Helmet):** The Express backend integrates `helmet` with custom Content Security Policy (CSP) headers restricting script execution to authorized domains.

---

## 5. Authentication, Cookie & Token Security

### 5.1 Token Lifetimes & Refresh Strategy
- **Access Tokens (JWT):** Short-lived (default: `1d` for dev, recommended `15m` for high-security production). Signed using HMAC-SHA256 (`HS256`) with `JWT_SECRET` (minimum 32 random characters).
- **Refresh Strategy:** Long-lived refresh tokens stored either in `HttpOnly` secure cookies or rotated via secure DB session tracking.

### 5.2 Cookie Security Attributes
When cookies are issued for session identification:
- `HttpOnly: true` (prevents malicious client-side JavaScript / XSS access).
- `Secure: true` in production (ensures cookies are transmitted exclusively over HTTPS).
- `SameSite: 'Lax'` or `'Strict'` (prevents Cross-Site Request Forgery / CSRF in cross-origin requests).

---

## 6. Secret Rotation Runbook

In the event of an employee exit, audit cycle, or credential refresh, execute the following steps:

### Step 1: JWT Secret Rotation
1. Generate new 64-character cryptographic key:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. Update `JWT_SECRET` in production secrets manager (AWS Secrets Manager / Render Environment / Doppler).
3. Gracefully reload backend workers. Active sessions will re-authenticate against MongoDB upon token expiry.

### Step 2: MongoDB Atlas Password Rotation
1. Log into MongoDB Atlas Console -> **Database Access**.
2. Select database user (`sai_admin_2026`), click **Edit**, and generate a new password.
3. Update `MONGODB_URI` in backend environment.
4. Restart application processes. Verify connection with `node validate_environment.js`.

### Step 3: Payment Gateway Keys (Razorpay & Stripe)
1. Generate new API keys in Razorpay / Stripe dashboard (Roll API Key with 24-hour grace period).
2. Update backend `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`.
3. Update frontend `VITE_RAZORPAY_KEY_ID` and rebuild frontend bundle (`npm run build`).
4. Revoke old keys once build is deployed.

---

## 7. Automated Secret Leakage Prevention

To ensure no engineer accidentally commits secrets to version control, integrate the following tools into the CI/CD pipeline:

### 7.1 Gitleaks / Git-Secrets Pre-Commit Hook
Install `gitleaks` in `.githooks/pre-commit`:
```bash
# Run gitleaks before every commit
gitleaks protect --verbose --redact --staged
```

### 7.2 Trivy Container & Dependency Scanning
Run vulnerability scans on backend Docker images:
```bash
trivy image sai-backend:latest --severity HIGH,CRITICAL
```

### 7.3 GitHub Secret Scanning & Dependabot
Enable GitHub secret scanning alerts and Dependabot automated security PRs on the repository.

---

## 8. Security Incident Response Protocol

If an API key, database URI, or JWT secret is detected in public logs, git history, or client bundles:

1. **Containment (Immediate - < 15 minutes):**
   - Revoke the compromised key in the provider console (MongoDB Atlas, Razorpay, ImageKit, Google Cloud).
   - Invalidate existing active JWT sessions if `JWT_SECRET` was leaked by rotating `JWT_SECRET`.
2. **Eradication (Within 1 hour):**
   - Purge git history using `git-filter-repo` or BFG Repo-Cleaner if accidentally committed.
   - Force-push sanitized history to remote repositories.
3. **Recovery & Deployment (Within 2 hours):**
   - Issue fresh credentials and inject via production environment vault.
   - Re-deploy backend and frontend applications.
4. **Post-Mortem & Audit:**
   - Review access logs during the breach window for unauthorized access or suspicious API activity.
   - Document root cause and add automated pre-commit guards to prevent recurrence.

