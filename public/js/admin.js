/**
 * VidyaPath - Admin Dashboard Controller
 */

let allSchemes = [];

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  loadStats();
  loadSchemesTable();
  setupAdminEvents();
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

async function loadStats() {
  try {
    const res = await fetch('/api/stats');
    const data = await res.json();
    if (data.success) {
      document.getElementById('statTotal').textContent = data.data.totalSchemes;
      document.getElementById('statCentral').textContent = data.data.centralGov;
      document.getElementById('statState').textContent = data.data.stateGov;
      document.getElementById('statCsr').textContent = data.data.corporateCsr;
    }
  } catch (err) {
    console.error('Error loading stats:', err);
  }
}

async function loadSchemesTable() {
  try {
    const res = await fetch('/api/schemes');
    const data = await res.json();
    if (data.success) {
      allSchemes = data.data;
      renderTable(allSchemes);
    }
  } catch (err) {
    console.error('Error loading schemes:', err);
  }
}

function renderTable(schemes) {
  const tbody = document.getElementById('adminSchemesTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  schemes.forEach(s => {
    const tr = document.createElement('tr');
    const incomeCap = s.criteria?.max_family_income ? '₹' + s.criteria.max_family_income.toLocaleString('en-IN') : 'None (Merit)';
    const minMarks = s.criteria?.min_percentage !== undefined ? s.criteria.min_percentage + '%' : 'N/A';

    tr.innerHTML = `
      <td><code>${escapeHtml(s.id)}</code></td>
      <td style="font-weight: 600;">${escapeHtml(s.name)}</td>
      <td><span class="badge badge-neutral">${escapeHtml(s.category_type)}</span></td>
      <td>${incomeCap}</td>
      <td>${minMarks}</td>
      <td style="color: var(--accent-success); font-weight: 700;">${escapeHtml(s.award_amount || '')}</td>
      <td>${escapeHtml(s.deadline || '')}</td>
      <td>
        <button type="button" class="action-btn-sm action-btn-danger" data-delete-id="${s.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Attach delete handlers
  tbody.querySelectorAll('[data-delete-id]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-delete-id');
      if (confirm(`Are you sure you want to delete scheme: ${id}?`)) {
        await deleteScheme(id);
      }
    });
  });
}

async function deleteScheme(id) {
  try {
    const res = await fetch(`/api/admin/schemes/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      alert('Scheme deleted successfully.');
      loadStats();
      loadSchemesTable();
    } else {
      alert('Failed: ' + data.error);
    }
  } catch (err) {
    console.error(err);
    alert('Error connecting to server.');
  }
}

function setupAdminEvents() {
  const searchInput = document.getElementById('adminSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      const filtered = allSchemes.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.provider.toLowerCase().includes(q)
      );
      renderTable(filtered);
    });
  }

  const modal = document.getElementById('addSchemeModal');
  const openBtn = document.getElementById('openAddModalBtn');
  const closeBtn = document.getElementById('closeAddModalBtn');
  const cancelBtn = document.getElementById('cancelAddBtn');

  if (openBtn && modal) openBtn.onclick = () => modal.style.display = 'flex';
  if (closeBtn && modal) closeBtn.onclick = () => modal.style.display = 'none';
  if (cancelBtn && modal) cancelBtn.onclick = () => modal.style.display = 'none';

  const form = document.getElementById('newSchemeForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const maxIncVal = document.getElementById('new_max_income').value;
      const newScheme = {
        name: document.getElementById('new_name').value,
        provider: document.getElementById('new_provider').value,
        category_type: document.getElementById('new_category_type').value,
        description: document.getElementById('new_description').value,
        award_amount: document.getElementById('new_award_amount').value,
        award_amount_num: Number(document.getElementById('new_award_amount_num').value),
        deadline: document.getElementById('new_deadline').value,
        official_url: document.getElementById('new_official_url').value,
        criteria: {
          education_levels: ['All'],
          allowed_streams: ['Any'],
          min_percentage: Number(document.getElementById('new_min_percentage').value),
          max_family_income: maxIncVal ? Number(maxIncVal) : null,
          genders: ['All'],
          categories: ['All'],
          religions: ['All'],
          states: ['All India'],
          is_pwd_required: false,
          min_disability_percentage: 0,
          is_single_girl_child: false,
          is_ward_of_defense: false,
          is_rural_only: false
        },
        required_documents: [
          'Aadhaar Card',
          'Family Income Certificate',
          'Previous Qualifying Marksheet',
          'College Admission Bonafide'
        ],
        steps_to_apply: [
          'Register on official portal with Aadhaar',
          'Fill application with academic details',
          'Upload verified supporting certificates',
          'Submit and download confirmation acknowledgement'
        ]
      };

      try {
        const res = await fetch('/api/admin/schemes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newScheme)
        });
        const data = await res.json();
        if (data.success) {
          alert('Scholarship scheme created successfully!');
          modal.style.display = 'none';
          form.reset();
          loadStats();
          loadSchemesTable();
        } else {
          alert('Failed: ' + (data.error || 'Server error'));
        }
      } catch (err) {
        alert('Failed to connect to server.');
      }
    });
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
