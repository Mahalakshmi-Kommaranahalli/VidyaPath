# 🎓 VidyaPath — Scholarship & Government Scheme Matchmaker

> **National Integrated Scholarship & Institutional Verification Network**
> Direct institutional login for students via their School/College ID, electronic routing of applications to College Nodal Officers, original document verification (Aadhaar, Caste, Income, Photo, Biometric e-KYC), and end-to-end matching from Class 10th to PhD and Overseas Studies.

---

## 🌟 New Features Built

### 1. 🔐 Official Institutional Login Portal (`/login.html`)
- **Official Government Portal Aesthetic:** National tricolor ribbon, Ministry/State educational emblem motifs, bilingual headers, and SSL secure badge formatting.
- **Dual Gateway:**
  - **Student Login:** Student selects their verified School or College from the AISHE-accredited institutional directory and enters their Institutional Roll Number / USN / Admission ID and Password.
  - **College Nodal Officer Login:** Designated college scholarship coordinators log in via Institution AISHE Code and Master Password.
- **1-Click Quick Demo Sign-In:** Test accounts pre-configured for instant 1-click evaluation without typing.

### 2. 🏛️ College / School Nodal Officer Desk (`/college-portal.html`)
- When a student applies for any scholarship, the application is **electronically routed to their respective college**.
- The College Nodal Officer can:
  - View real-time counters: *Total Applications Received, Pending Scrutiny, Verified & Approved, Rejected/Defective*.
  - Inspect student academic records (course, semester, qualifying marks %, family income).
  - Inspect verified original documents submitted by the student:
    - 📄 **Aadhaar Card:** UIDAI-verified 12-digit number with masked view.
    - 📜 **Caste Certificate:** Verified via Revenue Department barcode (RD Number).
    - 💰 **Income Certificate:** Certified by Tehsildar / Competent Revenue Authority.
    - 🖼️ **Passport Photograph:** Live photo preview.
    - 🧬 **Biometric Authentication:** Face-RD / Iris e-KYC authentication status with timestamp.
  - **Action Buttons:** "E-Attest & Approve to State/NSP Portal" or "Reject / Sent Back for Correction with Remarks".

### 3. 🌙 Dark Mode & Light Mode
- High-contrast, sleek Dark Mode available with a single click (`🌙 Dark Mode` / `☀️ Light Mode`) on every page.
- State is preserved persistently in `localStorage`.

### 4. 📚 Complete Educational Lifecycle (Class 10th to PhD & Study Abroad)
- **Class 10 (Secondary / Pre-Matric):** NMMSS, Pre-Matric SC/ST, Begum Hazrat Mahal, PM-YASASVI Pre-Matric, Vidyadhan.
- **Class 11 & 12 (Higher Secondary / PUC):** CBSE Single Girl Child, PM-YASASVI Post-Matric, LIC Golden Jubilee, Santoor Women's Scholarship.
- **ITI & Polytechnic Diploma:** National ITI Technical Apprenticeship, AICTE Pragati & Saksham Diploma.
- **Undergraduate (Degree / B.Tech / MBBS / B.Sc / BA):** Central Sector Scheme, Post-Matric SC/ST, Reliance Foundation, Tata Trusts, HDFC Badhte Kadam, Kotak Kanya, State DBT (Karnataka SSP, MahaDBT, TN, UP, Kerala).
- **Postgraduate (Master's / M.Tech / MD / MBA):** UGC Indira Gandhi Single Girl Child PG, Post-Matric SC/ST PG.
- **PhD / Doctoral Research:** CSIR-UGC NET JRF (₹37,000–₹42,000/mo), ICMR JRF, NFPwD Fellowship.
- **Study Abroad / Overseas:** National Overseas Scholarship (NOS) providing 100% full tuition + US $15,400/yr living allowance.

---

## 🚀 Quick Access URLs

The application is currently running live on port **3000**:

- 🌐 **Student Matching Portal:** [http://localhost:3000](http://localhost:3000)
- 🔐 **Official Institutional Login:** [http://localhost:3000/login.html](http://localhost:3000/login.html)
- 🏛️ **College Nodal Officer Desk:** [http://localhost:3000/college-portal.html](http://localhost:3000/college-portal.html)
- ⚙️ **Admin Scheme Dashboard:** [http://localhost:3000/admin.html](http://localhost:3000/admin.html)
- 📡 **Health API:** [http://localhost:3000/health](http://localhost:3000/health)

---

## 🧪 Automated Testing (25 / 25 Passing)

```bash
npm test
```
All **25 automated unit and integration tests** pass with 0 errors, validating institutional authentication, college application routing, original document verification, matching criteria, and boundaries.

---

## 📄 License
MIT License. Built for national educational access and institutional equity.
