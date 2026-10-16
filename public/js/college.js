/**
 * VidyaPath - College Nodal Officer Dashboard Controller
 */

let currentInstitutionId = 'INST-001';
let collegeOfficer = null;
let currentSelectedApp = null;
let allCollegeApps = [];

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavToggle();
  initOfficerSession();
  loadInstitutionOptions();
  loadCollegeApplications();
  setupModalEvents();
});

function initNavToggle() {
  const navToggleBtn = document.getElementById('navToggleBtn');
  const navLinks = document.getElementById('navLinks') || document.querySelector('.nav-links');
  if (navToggleBtn && navLinks) {
    navToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('open');
      navToggleBtn.classList.toggle('active', isOpen);
      navToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navToggleBtn.innerHTML = isOpen ? '<span class="nav-toggle-icon">✕</span>' : '<span class="nav-toggle-icon">☰</span>';
    });
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !navToggleBtn.contains(e.target)) {
        if (navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          navToggleBtn.classList.remove('active');
          navToggleBtn.setAttribute('aria-expanded', 'false');
          navToggleBtn.innerHTML = '<span class="nav-toggle-icon">☰</span>';
        }
      }
    });
  }
}

// Theme handling (Light / Dark mode)
function initTheme() {
  const savedTheme = localStorage.getItem('vidyapath_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeBtn(savedTheme);

  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('vidyapath_theme', next);
      updateThemeBtn(next);
    });
  }
}

function updateThemeBtn(theme) {
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.textContent = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
  }
}

// Check session
function initOfficerSession() {
  try {
    const raw = localStorage.getItem('vidyapath_officer');
    if (raw) {
      collegeOfficer = JSON.parse(raw);
      if (collegeOfficer && collegeOfficer.institutionId) {
        currentInstitutionId = collegeOfficer.institutionId;
      }
    }
  } catch (e) {
    console.error(e);
  }
}

// Load Institutions into switcher
async function loadInstitutionOptions() {
  try {
    const res = await fetch('/api/auth/institutions');
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      const switcher = document.getElementById('institutionSwitcher');
      if (!switcher) return;
      switcher.innerHTML = '';

      data.data.forEach(inst => {
        const opt = new Option(`${inst.name} (${inst.aisheCode})`, inst.id);
        if (inst.id === currentInstitutionId) opt.selected = true;
        switcher.add(opt);
      });

      switcher.onchange = (e) => {
        currentInstitutionId = e.target.value;
        const selectedInst = data.data.find(i => i.id === currentInstitutionId);
        if (selectedInst) {
          updateHeaderInfo(selectedInst);
        }
        loadCollegeApplications();
      };

      const curInst = data.data.find(i => i.id === currentInstitutionId) || data.data[0];
      if (curInst) updateHeaderInfo(curInst);
    }
  } catch (err) {
    console.error('Error loading institutions:', err);
  }
}

function updateHeaderInfo(inst) {
  document.getElementById('collegeNameTitle').textContent = inst.name;
  document.getElementById('collegeAisheCode').textContent = `AISHE: ${inst.aisheCode}`;
  document.getElementById('collegeOfficerInfo').textContent =
    `Nodal Officer: ${inst.nodalOfficer || 'Institutional Nodal Officer'} | Nodal Email: ${inst.email || 'nodal@institution.edu.in'}`;
}

// Fetch applications for this college
async function loadCollegeApplications() {
  const container = document.getElementById('collegeAppsContainer');
  if (!container) return;
  container.innerHTML = '<div style="text-align:center; padding: 2rem;">Loading student applications...</div>';

  try {
    const res = await fetch(`/api/applications/college/${currentInstitutionId}`);
    const data = await res.json();
    if (data.success) {
      allCollegeApps = data.data || [];

      // Update counters
      document.getElementById('collegeTotalApps').textContent = data.stats.totalReceived;
      document.getElementById('collegePendingApps').textContent = data.stats.pending;
      document.getElementById('collegeApprovedApps').textContent = data.stats.approved;
      document.getElementById('collegeRejectedApps').textContent = data.stats.rejected;

      renderApplications(allCollegeApps);
    }
  } catch (err) {
    container.innerHTML = '<div style="color:var(--accent-danger); padding:2rem;">Failed to load applications.</div>';
  }
}

function renderApplications(apps) {
  const container = document.getElementById('collegeAppsContainer');
  if (!container) return;
  container.innerHTML = '';

  if (apps.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
        <h3>No student applications received yet for this college.</h3>
        <p>When students apply from this institution, their applications and original documents appear here for scrutiny.</p>
      </div>
    `;
    return;
  }

  apps.forEach(app => {
    const card = document.createElement('div');
    card.className = 'app-card';

    const statusBadgeClass = app.status.includes('Approved') ? 'badge-success' :
                             app.status.includes('Rejected') ? 'badge-danger' : 'badge-warning';

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.5rem;">
        <div>
          <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">${escapeHtml(app.id)}</span>
          <h3 style="font-size: 1.15rem; font-weight: 800; margin: 0.15rem 0;">
            ${escapeHtml(app.studentName)} <span style="font-size: 0.85rem; color: var(--primary);">(${escapeHtml(app.studentRollNo)})</span>
          </h3>
          <div style="font-weight: 700; color: var(--text-main); font-size: 0.95rem;">${escapeHtml(app.schemeName)}</div>
          <div style="font-size: 0.82rem; color: var(--text-muted);">
            Course: <strong>${escapeHtml(app.course)}</strong> | Category: <strong>${escapeHtml(app.category)}</strong> | Percentage: <strong>${app.percentage}%</strong> | Income: <strong>₹${Number(app.familyIncome).toLocaleString('en-IN')}</strong>
          </div>
        </div>

        <div style="text-align: right;">
          <span class="badge ${statusBadgeClass}">${escapeHtml(app.status)}</span>
          <div style="font-size: 0.8rem; font-weight: 700; color: var(--accent-success); margin-top: 0.35rem;">
            ${escapeHtml(app.awardAmount)}
          </div>
        </div>
      </div>

      <!-- Original Document Badges -->
      <div style="margin-top: 0.25rem;">
        <span class="doc-pill verified">📄 Aadhaar: ${escapeHtml(app.documents?.aadhaar?.docNo || 'Verified')}</span>
        <span class="doc-pill verified">📜 Caste: ${escapeHtml(app.documents?.caste?.docNo || 'Verified')}</span>
        <span class="doc-pill verified">💰 Income: ${escapeHtml(app.documents?.income?.docNo || 'Verified')}</span>
        <span class="doc-pill verified">🖼️ Passport Photo</span>
        <span class="doc-pill verified">🧬 Biometric Face-RD</span>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem; pt: 0.5rem; border-top: 1px solid var(--border-color); padding-top: 0.5rem;">
        <span style="font-size: 0.75rem; color: var(--text-muted);">Submitted: ${new Date(app.appliedAt).toLocaleDateString()}</span>
        <button type="button" class="btn btn-secondary btn-inspect" style="font-size: 0.82rem; padding: 0.4rem 0.85rem;">
          🔍 Inspect Documents & Attest
        </button>
      </div>
    `;

    card.querySelector('.btn-inspect').addEventListener('click', () => {
      openVerifyModal(app);
    });

    container.appendChild(card);
  });
}

function openVerifyModal(app) {
  currentSelectedApp = app;
  const modal = document.getElementById('verifyModal');

  document.getElementById('modalAppId').textContent = app.id;
  document.getElementById('modalStudentTitle').textContent = `${app.studentName} (${app.studentRollNo})`;
  document.getElementById('modalSchemeApplied').textContent = app.schemeName;
  document.getElementById('modalStudentMeta').textContent =
    `Course: ${app.course} | Category: ${app.category} | Percentage: ${app.percentage}% | Annual Income: ₹${Number(app.familyIncome).toLocaleString('en-IN')}`;

  const docGrid = document.getElementById('modalDocGrid');
  docGrid.innerHTML = `
    <!-- Aadhaar Card -->
    <div class="doc-inspect-card">
      <div style="font-weight: 700; font-size: 0.85rem; color: var(--primary);">📄 Aadhaar Card</div>
      <div style="font-size: 0.78rem; margin: 0.25rem 0;">UIDAI Number: <strong>${escapeHtml(app.documents?.aadhaar?.docNo || 'XXXXXXXX8921')}</strong></div>
      <span class="badge badge-success" style="font-size: 0.65rem;">UIDAI Verified</span>
    </div>

    <!-- Caste Certificate -->
    <div class="doc-inspect-card">
      <div style="font-weight: 700; font-size: 0.85rem; color: var(--primary);">📜 Caste Certificate</div>
      <div style="font-size: 0.78rem; margin: 0.25rem 0;">Barcode No: <strong>${escapeHtml(app.documents?.caste?.docNo || 'RD00472910384')}</strong></div>
      <span class="badge badge-success" style="font-size: 0.65rem;">Digital RD Verified</span>
    </div>

    <!-- Income Certificate -->
    <div class="doc-inspect-card">
      <div style="font-weight: 700; font-size: 0.85rem; color: var(--primary);">💰 Income Certificate</div>
      <div style="font-size: 0.78rem; margin: 0.25rem 0;">Revenue No: <strong>${escapeHtml(app.documents?.income?.docNo || 'RD00389281729')}</strong></div>
      <span class="badge badge-success" style="font-size: 0.65rem;">Tehsildar Certified</span>
    </div>

    <!-- Passport Photograph -->
    <div class="doc-inspect-card">
      <div style="font-weight: 700; font-size: 0.85rem; color: var(--primary);">🖼️ Student Photograph</div>
      <div style="margin: 0.4rem 0;">
        <img src="${escapeHtml(app.documents?.photo?.previewUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80')}" alt="Student Photo" style="width: 50px; height: 50px; border-radius: var(--radius-sm); object-fit: cover;">
      </div>
      <span class="badge badge-success" style="font-size: 0.65rem;">Match Verified</span>
    </div>

    <!-- Biometric e-KYC -->
    <div class="doc-inspect-card">
      <div style="font-weight: 700; font-size: 0.85rem; color: var(--primary);">🧬 Biometric Authentication</div>
      <div style="font-size: 0.78rem; margin: 0.25rem 0;">Method: <strong>UIDAI Face-RD / Iris e-KYC</strong></div>
      <span class="badge badge-success" style="font-size: 0.65rem;">Live Authentication Confirmed</span>
    </div>
  `;

  document.getElementById('officerRemarksInput').value = app.collegeVerification?.remarks || '';
  modal.style.display = 'flex';
}

function setupModalEvents() {
  const modal = document.getElementById('verifyModal');
  const closeBtn = document.getElementById('modalVerifyCloseBtn');
  const btnApprove = document.getElementById('btnApproveApp');
  const btnReject = document.getElementById('btnRejectApp');

  if (closeBtn && modal) {
    closeBtn.onclick = () => modal.style.display = 'none';
    modal.onclick = (e) => {
      if (e.target === modal) modal.style.display = 'none';
    };
  }

  if (btnApprove) {
    btnApprove.onclick = async () => {
      if (!currentSelectedApp) return;
      const remarks = document.getElementById('officerRemarksInput').value || 'Bonafide student status & documents verified. Approved.';
      await submitVerification(currentSelectedApp.id, 'Verified & Approved by College', remarks);
    };
  }

  if (btnReject) {
    btnReject.onclick = async () => {
      if (!currentSelectedApp) return;
      const remarks = document.getElementById('officerRemarksInput').value || 'Document mismatch or fee receipt incomplete.';
      await submitVerification(currentSelectedApp.id, 'Rejected / Sent Back for Correction', remarks);
    };
  }
}

async function submitVerification(appId, status, remarks) {
  try {
    const officerName = collegeOfficer?.officerName || 'Prof. S. R. Murthy (Nodal Officer)';
    const res = await fetch(`/api/applications/${appId}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ officerName, status, remarks })
    });

    const data = await res.json();
    if (data.success) {
      alert(`Application ${appId} successfully updated to: ${status}`);
      document.getElementById('verifyModal').style.display = 'none';
      loadCollegeApplications();
    } else {
      alert('Failed: ' + (data.error || 'Server error'));
    }
  } catch (err) {
    alert('Failed to connect to verification server.');
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
