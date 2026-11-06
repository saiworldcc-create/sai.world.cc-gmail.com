# Sai International Couriers & Cargo
## Environment Variables Reference Dictionary (`ENVIRONMENT_VARIABLES_REFERENCE.md`)

This document defines every environment variable across the Backend, Frontend, and Mobile applications.

---

## 1. Backend Environment Variables (`sai_international_two/backend/.env`)

| Variable Name | Required? | Classification | Default Value | Description & Constraints |
| :--- | :---: | :---: | :--- | :--- |
| `NODE_ENV` | **Required** | Public | `development` | Runtime environment: `development`, `test`, `staging`, `production`. |
| `PORT` | Optional | Public | `5000` | TCP port on which the Express HTTP server listens. |
| `APP_NAME` | Optional | Public | `Sai International Couriers API` | Application identifier in logs and health check outputs. |
| `MONGODB_URI` | **Required** | **Secret** | *None* | Connection string for MongoDB Atlas or local replica set. Must start with `mongodb://` or `mongodb+srv://`. |
| `JWT_SECRET` | **Required** | **Secret** | *None* | Secret key used to sign and verify JSON Web Tokens. In production, must be $\ge 32$ characters high-entropy hex string. |
| `JWT_EXPIRES_IN` | Optional | Public | `7d` | Token expiration duration (e.g., `7d`, `24h`, `30d`). |
| `ADMIN_EMAIL` | Optional | Public | `sai.world.cc@gmail.com` | Default email for seeding the initial Super Admin account during database bootstrapping. |
| `ADMIN_PASSWORD` | Optional | **Secret** | `SaiAdmin@2026` | Default password for seeding the initial Super Admin account. Change immediately upon deployment. |
| `CORS_ORIGIN` | **Required in Prod** | Public | `*` | Comma-separated list of allowed origins (e.g., `https://sai-international.com,https://admin.sai-international.com`). |
| `REDIS_URL` | Optional | **Secret** | *None* | Redis connection URI (`redis://` or `rediss://`). If omitted, system falls back to in-memory queue. |
| `RAZORPAY_KEY_ID` | Optional | Public | *None* | Razorpay merchant key ID (`rzp_test_...` or `rzp_live_...`). Required for online payment bookings. |
| `RAZORPAY_KEY_SECRET` | Optional | **Secret** | *None* | Razorpay secret key used for HMAC SHA256 payment signature verification. |
| `STRIPE_SECRET_KEY` | Optional | **Secret** | *None* | Stripe secret key (`sk_test_...` or `sk_live_...`) for alternative credit card checkout. |
| `STRIPE_WEBHOOK_SECRET`| Optional | **Secret** | *None* | Stripe webhook signature signing secret (`whsec_...`). |
| `GEMINI_API_KEY` | Optional | **Secret** | *None* | Google Gemini 2.5 Flash API key for conversational AI logistics assistant. |
| `IMAGEKIT_PUBLIC_KEY` | Optional | Public | *None* | ImageKit public key for media and Proof of Delivery (POD) image upload client tokens. |
| `IMAGEKIT_PRIVATE_KEY`| Optional | **Secret** | *None* | ImageKit private key for server-side media upload and file deletion. |
| `IMAGEKIT_URL_ENDPOINT`| Optional | Public | *None* | ImageKit endpoint URL (e.g., `https://ik.imagekit.io/your_id`). |
| `SMTP_HOST` | Optional | Public | `smtp.gmail.com` | Mail transfer agent hostname (e.g., `smtp.sendgrid.net`, `smtp.gmail.com`). |
| `SMTP_PORT` | Optional | Public | `465` | SMTP port (`465` for SSL, `587` for TLS). |
| `SMTP_SECURE` | Optional | Public | `true` | Boolean flag indicating whether to establish a TLS connection immediately upon connecting. |
| `SMTP_USER` | Optional | Public | *None* | Authenticated SMTP username or API key name (`apikey` for SendGrid). |
| `SMTP_PASS` | Optional | **Secret** | *None* | Authenticated SMTP password, app password, or API key string. |
| `EMAIL_FROM` | Optional | Public | *Auto-generated* | Display name and email address appearing in the `From:` header of transactional receipts. |
| `ALERT_EMAIL` | Optional | Public | *None* | Internal administrator email recipient for dispatch tickets and booking alerts. |
| `GOOGLE_CLIENT_ID` | Optional | Public | *None* | Google OAuth 2.0 Web Client ID for validating Google Single Sign-On tokens. |

---

## 2. Frontend Environment Variables (`sai_international_two/frontend/.env`)

> [!CAUTION]
> All variables in the frontend must begin with `VITE_`. Because these variables are embedded into client-side JavaScript, **NEVER store private API keys, database passwords, or JWT secrets in frontend variables**.

| Variable Name | Required? | Classification | Default Value | Description |
| :--- | :---: | :---: | :--- | :--- |
| `VITE_API_URL` | **Required** | Public | `http://localhost:5000/api/v1` | Base REST API endpoint URL consumed by Axios client in `services/api.js`. |
| `VITE_SOCKET_URL` | Optional | Public | `http://localhost:5000` | Server host for real-time Socket.IO GPS driver telematics connection. |
| `VITE_GOOGLE_CLIENT_ID`| Optional | Public | *None* | Public Google OAuth client ID for rendering the Google Sign-In button component. |
| `VITE_RAZORPAY_KEY_ID` | Optional | Public | *None* | Public Razorpay key ID passed to client-side checkout popup modal. |
| `VITE_APP_NAME` | Optional | Public | `Sai International Couriers` | Branding application title displayed in header and browser tab titles. |
| `VITE_APP_ENV` | Optional | Public | `development` | Client-side environment indicator (`development`, `staging`, `production`). |

---

## 3. Mobile / Android Environment Variables (`.env.mobile`)

| Target Runtime | Variable | Target Setting | Purpose |
| :--- | :--- | :--- | :--- |
| **Android Studio Emulator** | `VITE_API_URL` | `http://10.0.2.2:5000/api/v1` | 10.0.2.2 redirects network calls to host machine's `localhost:5000`. |
| **Physical Android Device (LAN)**| `VITE_API_URL` | `http://<DEV_PC_IP>:5000/api/v1` | Enables hardware mobile devices on the same Wi-Fi network to call local backend. |
| **Staging APK** | `VITE_API_URL` | `https://staging-api.sai-couriers.com/api/v1` | Pre-release distribution build for staff and QA testing. |
| **Production Google Play Store** | `VITE_API_URL` | `https://api.sai-international.com/api/v1` | Signed release build with HTTPS and secure network security config. |

