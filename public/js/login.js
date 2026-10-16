/**
 * VidyaPath - Official Institutional Login Controller
 */

let institutionsList = [];

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavToggle();
  loadInstitutions();
  setupAuthTabs();
  setupLoginForms();
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

// Load Institutions from API
async function loadInstitutions() {
  try {
    const res = await fetch('/api/auth/institutions');
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      institutionsList = data.data;

      const studentSelect = document.getElementById('studentInstitution');
      const officerSelect = document.getElementById('officerInstitution');

      institutionsList.forEach(inst => {
        const text = `${inst.name} (${inst.aisheCode} - ${inst.district})`;
        const opt1 = new Option(text, inst.id);
        const opt2 = new Option(text, inst.id);
        if (studentSelect) studentSelect.add(opt1);
        if (officerSelect) officerSelect.add(opt2);
      });
    }
  } catch (err) {
    console.error('Failed to load institutions:', err);
  }
}

// Tab Switching
function setupAuthTabs() {
  const tabStudent = document.getElementById('tabStudentBtn');
  const tabOfficer = document.getElementById('tabOfficerBtn');
  const studentForm = document.getElementById('studentLoginForm');
  const officerForm = document.getElementById('officerLoginForm');

  if (tabStudent && tabOfficer) {
    tabStudent.onclick = () => {
      tabStudent.classList.add('active');
      tabOfficer.classList.remove('active');
      studentForm.style.display = 'block';
      officerForm.style.display = 'none';
    };

    tabOfficer.onclick = () => {
      tabOfficer.classList.add('active');
      tabStudent.classList.remove('active');
      officerForm.style.display = 'block';
      studentForm.style.display = 'none';
    };
  }
}

// Handle Form Submissions
function setupLoginForms() {
  // Student Login
  const studentForm = document.getElementById('studentLoginForm');
  if (studentForm) {
    studentForm.onsubmit = async (e) => {
      e.preventDefault();
      const institutionId = document.getElementById('studentInstitution').value;
      const studentRollNo = document.getElementById('studentRollNo').value;
      const password = document.getElementById('studentPassword').value;

      if (!institutionId || !studentRollNo) {
        alert('Please select your College/School and enter your Roll No/USN.');
        return;
      }

      try {
        const res = await fetch('/api/auth/student/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ institutionId, studentRollNo, password })
        });
        const data = await res.json();
        if (data.success) {
          localStorage.setItem('vidyapath_user', JSON.stringify(data.user));
          window.location.href = '/?login=success';
        } else {
          alert(data.error || 'Login failed. Please check credentials.');
        }
      } catch (err) {
        alert('Failed to connect to authentication server.');
      }
    };
  }

  // Officer Login
  const officerForm = document.getElementById('officerLoginForm');
  if (officerForm) {
    officerForm.onsubmit = async (e) => {
      e.preventDefault();
      const institutionId = document.getElementById('officerInstitution').value;
      const password = document.getElementById('officerPassword').value;

      if (!institutionId) {
        alert('Please select your institution.');
        return;
      }

      try {
        const res = await fetch('/api/auth/officer/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ institutionId, password })
        });
        const data = await res.json();
        if (data.success) {
          localStorage.setItem('vidyapath_officer', JSON.stringify(data.user));
          window.location.href = '/college-portal.html';
        } else {
          alert(data.error || 'Login failed.');
        }
      } catch (err) {
        alert('Failed to connect to authentication server.');
      }
    };
  }
}
