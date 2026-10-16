# 🎓 VidyaPath — National Scholarship & Government Scheme Matchmaker

> **Centralized National Educational Access & Institutional Verification Portal**  
> Universal web portal and smart algorithmic matchmaking engine covering educational assistance from **Class 10th (Secondary/Pre-Matric) through Undergraduate, Postgraduate, Doctoral (PhD), and National Overseas Studies** across India. Works universally for **all recognized schools, colleges, polytechnics, and universities** (AISHE & UDISE+ accredited).

---

## 🌟 Key Features

### 1. 🏛️ Universal All-India Educational Coverage
- Works across all recognized government, aided, autonomous, and private institutions nationwide.
- Covers Central Government ministries, State Governments (Karnataka, Maharashtra, Tamil Nadu, Uttar Pradesh, Kerala, Delhi, etc.), and corporate CSR trusts.
- Students and Nodal Officers can select their institution category or enter their AISHE/UDISE+ code directly.

### 2. 🎨 Official Government Portal Aesthetics
- High-contrast, authoritative visual design following official national portal design guidelines:
  - **Deep Navy (`#0f2744`)**: Primary authority base and headers.
  - **Sky Blue (`#0ea5e9`)**: Primary action buttons, active tabs, and interactive elements.
  - **Warm Gold (`#f59e0b`)**: Official seals, Ashoka Chakra accents, and gazette notice tags.
  - **Crisp White (`#ffffff`)**: Clean card backgrounds and high-contrast surfaces.
- **Dark Mode Support**: Persistent dark theme with one-click toggle.

### 3. 🇮🇳 Respected Indian Education & Welfare Department Seals
Integrated official emblems and logos representing:
- **Ministry of Education (शिक्षा मंत्रालय - MoE)**
- **National Scholarship Portal (NSP / DBT Bharat - प्रत्यक्ष लाभ अंतरण)**
- **University Grants Commission (UGC - "ज्ञान-विज्ञान विमुक्तये")**
- **All India Council for Technical Education (AICTE - "योगः कर्मसु कौशलम्")**
- **Central Board of Secondary Education (CBSE - "असतो मा सद्गमय")**
- **Ministry of Social Justice & Empowerment (MSJE)**
- **Ministry of Tribal Affairs (MoTA)**
- **Ministry of Minority Affairs (MoMA)**

### 4. 📢 Live Official Announcements & Gazette Circulars Bulletin
- Real-time notification board with live blinking beacon (`🔴 LIVE OFFICIAL NOTICES`).
- Includes Gazette Circular numbers, deadline extensions, and direct links to official ministry portals.

### 5. 🔐 Institutional Verification & Document E-Attestation Desk (`/college-portal.html`)
- Applications submitted by students are electronically routed to their respective school/college.
- Nodal officers inspect verified original documents:
  - 📄 **Aadhaar Card:** UIDAI-verified.
  - 📜 **Caste Certificate:** Revenue Department verified (RD Number).
  - 💰 **Income Certificate:** Tahsildar / Competent Authority certified.
  - 🖼️ **Passport Photo:** Preview enabled.
  - 🧬 **Biometric / Face-RD e-KYC:** Real-time verification status.
- Nodal officers can e-attest and approve or defect/reject applications with remarks.

---

## 🚀 Local Execution

```bash
# Install dependencies
npm install

# Run automated test suite (25/25 passing)
npm test

# Start the web server
npm start
```

Access locally at:
- **Main Portal:** `http://localhost:3000`
- **Institutional Login:** `http://localhost:3000/login.html`
- **Verification Desk:** `http://localhost:3000/college-portal.html`
- **Admin Dashboard:** `http://localhost:3000/admin.html`
- **Health Endpoint:** `http://localhost:3000/health`

---

## 📤 How to Push to GitHub

1. Go to [github.com/new](https://github.com/new) and create a new repository (e.g. named `VidyaPath`).
2. Run the following commands in the terminal inside the project directory:

```bash
# Add your GitHub repository as remote origin
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/VidyaPath.git

# Push to GitHub
git push -u origin main
```

*(If prompted, authenticate using your GitHub Personal Access Token or browser sign-in).*

---

## ☁️ How to Deploy (Live in 2 Minutes)

### Option A: Deploy on Render.com (Recommended — 100% Free)
1. Go to [render.com](https://render.com) and sign in with GitHub.
2. Click **New +** → **Web Service**.
3. Select your `VidyaPath` GitHub repository.
4. Render will automatically detect the settings from `render.yaml`:
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Click **Create Web Service**. Your app will be live with a free `https://vidyapath-xxx.onrender.com` SSL URL!

### Option B: Deploy on Railway
1. Go to [railway.app](https://railway.app) and click **Start a New Project** → **Deploy from GitHub repo**.
2. Select `VidyaPath`. Railway will automatically read `Procfile` and deploy your app.

---

## 🧪 Automated Testing

```bash
npm test
```
All **25 unit and integration tests** pass, validating:
- Matching algorithm edge cases (cutoffs, income ceilings, domicile, PwD, girl child, rural flags).
- REST API endpoints (`/api/match`, `/api/schemes`, `/api/announcements`, `/api/auth`, `/api/applications`).
- Institutional document verification workflow.

---

## 📄 License
MIT License. Built for national educational equity and transparency.
