# Sai International Couriers & Cargo
## Enterprise Environment Setup & Deployment Guide (`ENVIRONMENT_SETUP.md`)

**Target Systems:** Windows, Linux, macOS, Docker, Android  
**Version:** 2.2.0-ENTERPRISE  
**Architecture:** Distributed MERN Stack + Capacitor Mobile Container  

---

## 1. Quick Start (Local Development & Demo)

### Prerequisites
* **Node.js:** v18.0.0 or higher (v24.x tested & verified)
* **npm:** v10.0.0 or higher
* **Git:** Latest version
* **MongoDB:** MongoDB Atlas connection string (or local MongoDB on port 27017)

### Step 1: Clone & Navigate
```bash
git clone <repository_url>
cd "Sai international"
```

### Step 2: Configure Backend Environment
Navigate to the backend directory and initialize the local environment configuration:
```bash
cd sai_international_two/backend
cp .env.development.example .env
```
*(On Windows PowerShell, use: `Copy-Item .env.development.example .env`)*

Review your `.env` and verify `MONGODB_URI` points to your Atlas cluster or local instance.

### Step 3: Configure Frontend Environment
Navigate to the frontend directory and initialize the client configuration:
```bash
cd ../frontend
cp .env.development.example .env
```
*(On Windows PowerShell, use: `Copy-Item .env.development.example .env`)*

Verify `VITE_API_URL=http://localhost:5000/api/v1`.

### Step 4: Validate Environments Automatically
From the project root directory, run the validation tool:
```bash
node validate_environment.js
```
The validator audits configuration across Backend, Frontend, and Mobile without revealing secrets.

### Step 5: Start Local Services
Start backend and frontend in separate terminals:
```bash
# Terminal 1 — Backend API Server
cd sai_international_two/backend
npm install
npm run dev

# Terminal 2 — Frontend Application
cd sai_international_two/frontend
npm install
npm run dev
```

* **Frontend URL:** `http://localhost:5173`
* **Backend API:** `http://localhost:5000/api/health`

---

## 2. Automated Test Suite Setup (`.env.test`)

To run headless unit tests, API integration tests, or CI/CD pipelines without polluting development records:

1. Copy the test environment template:
   ```bash
   cd sai_international_two/backend
   cp .env.test.example .env.test
   ```
2. Run the automated QA suite:
   ```bash
   node run_qa_suite.js
   ```
   The test runner tests all endpoints, validation boundaries, and authentication isolation using sandbox mock keys.

---

## 3. Staging / UAT Environment Setup (`.env.staging`)

Staging environments mirror production architecture while using sandbox payment gateways and isolated staging databases:

1. Deploy backend with:
   ```bash
   cp sai_international_two/backend/.env.staging.example sai_international_two/backend/.env
   ```
2. Deploy frontend with:
   ```bash
   cp sai_international_two/frontend/.env.staging.example sai_international_two/frontend/.env
   ```
3. Set domain names with TLS/SSL:
   - Frontend: `https://staging.sai-couriers.com`
   - Backend API: `https://staging-api.sai-couriers.com`
4. Strict CORS will reject requests outside `https://staging.sai-couriers.com`.
5. Payment testing utilizes official Razorpay Sandbox keys.

---

## 4. Production Environment Setup (`.env.production`)

Production deployment requires strict adherence to enterprise security guidelines:

### Step 1: Generate High-Entropy Cryptographic Secrets
Generate a strong random 64-character hex string for `JWT_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### Step 2: Configure Production Backend `.env`
```bash
cd sai_international_two/backend
cp .env.production.example .env
```
Populate the following mandatory parameters:
* `MONGODB_URI`: Dedicated MongoDB Atlas M30+ cluster with TLS 1.3.
* `JWT_SECRET`: The 64-character random string generated in Step 1.
* `CORS_ORIGIN`: Exact production domains (e.g. `https://sai-international.com,https://admin.sai-international.com`).
* `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`: Live merchant credentials.
* `SMTP_USER` & `SMTP_PASS`: Dedicated SendGrid or AWS SES transactional credentials with SPF/DKIM verification.
* `IMAGEKIT_PUBLIC_KEY` & `IMAGEKIT_PRIVATE_KEY`: Live media CDN credentials.

### Step 3: Configure Production Frontend `.env`
```bash
cd ../frontend
cp .env.production.example .env
```
Ensure `VITE_API_URL=https://api.sai-international.com/api/v1`.

### Step 4: Run Pre-Flight Validation
Before starting production traffic, execute:
```bash
node validate_environment.js
```
The validator will abort if any required production credentials contain placeholder text or if secrets are leaked in frontend variables.

---

## 5. Android Capacitor Environment Setup

The mobile application container wraps the delivery executive workspace for native Android deployment:

### Android Emulator (Local Dev)
1. In `sai_international_two/frontend/.env`, set:
   ```env
   VITE_API_URL=http://10.0.2.2:5000/api/v1
   ```
2. Build and sync web assets:
   ```bash
   npm run build
   npx cap sync android
   ```
3. Open in Android Studio:
   ```bash
   npx cap open android
   ```

### Physical Android Device over Wi-Fi
1. Find your development workstation's LAN IP address (`ipconfig` on Windows or `ifconfig` on Linux/Mac).
2. Set `VITE_API_URL=http://<YOUR_LAN_IP>:5000/api/v1` (e.g. `http://192.168.1.100:5000/api/v1`).
3. Build, sync, and deploy to device over USB debugging.

### Production Android Release (Google Play Store)
1. Set `VITE_API_URL=https://api.sai-international.com/api/v1`.
2. Build web bundle: `npm run build`.
3. Sync native project: `npx cap sync android`.
4. In Android Studio, select **Build > Generate Signed Bundle / APK** using the official production release keystore.

