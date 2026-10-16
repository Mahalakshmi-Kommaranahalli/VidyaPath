/**
 * VidyaPath - Frontend Application Controller
 * Handles Accessibility, i18n, Dynamic Form Validation, API Matchmaking, and Checklists.
 */

// Multilingual Dictionary
const i18n = {
  en: {
    heroTitle: "Find Every Scholarship You Are Eligible For",
    heroSubtitle: "Single simplified form. Powerful matching algorithm. Discover central, state, and private schemes in seconds.",
    findButton: "Run Scholarship Matchmaker",
    findingButton: "Analyzing Eligibility Criteria...",
    eligibleTitle: "Matched Scholarships",
    allEligibleTab: "All Matches",
    highlyLikelyTab: "Highly Likely (>=80%)",
    closingSoonTab: "Closing Soon",
    nearMatchTab: "Near Matches",
    allDirectoryTab: "Browse All Directory",
    checklistTitle: "Tailored Document Checklist",
    stepsTitle: "Step-by-Step How to Apply",
    printReport: "Print / Export Guidance PDF",
    applyOfficial: "Apply on Official Portal",
    readAloud: "Read Aloud",
    incomeSliderLabel: "Annual Family Income:"
  },
  hi: {
    heroTitle: "अपनी पात्रता की हर छात्रवृत्ति तुरंत खोजें",
    heroSubtitle: "एक सरल फॉर्म। सटीक मिलान एल्गोरिदम। केंद्र, राज्य और निजी योजनाओं की सम्पूर्ण जानकारी सेकंडों में।",
    findButton: "पात्र छात्रवृत्तियां खोजें",
    findingButton: "पात्रता नियमों का विश्लेषण हो रहा है...",
    eligibleTitle: "आपके लिए उपलब्ध छात्रवृत्तियां",
    allEligibleTab: "सभी पात्र योजनाएं",
    highlyLikelyTab: "उच्च संभावना (>=80%)",
    closingSoonTab: "शीघ्र समाप्त हो रही",
    nearMatchTab: "समीपस्थ मिलान (लगभग पात्र)",
    allDirectoryTab: "सभी छात्रवृत्तियों की सूची",
    checklistTitle: "आवश्यक दस्तावेजों की सूची",
    stepsTitle: "आवेदन करने के चरण",
    printReport: "मार्गदर्शिका प्रिंट / डाउनलोड करें",
    applyOfficial: "आधिकारिक पोर्टल पर आवेदन करें",
    readAloud: "सुनें (आवाज)",
    incomeSliderLabel: "वार्षिक पारिवारिक आय:"
  },
  kn: {
    heroTitle: "ನಿಮಗೆ ಅರ್ಹವಿರುವ ಎಲ್ಲಾ ವಿದ್ಯಾರ್ಥಿವೇತನಗಳನ್ನು ತಕ್ಷಣ ಹುಡುಕಿ",
    heroSubtitle: "ಒಂದೇ ಸರಳ ಅರ್ಜಿ. ಕೇಂದ್ರ, ರಾಜ್ಯ ಹಾಗೂ ಖಾಸಗಿ ಯೋಜನೆಗಳ ಅರ್ಹತೆಯನ್ನು ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಪರಿಶೀಲಿಸಿ.",
    findButton: "ವಿದ್ಯಾರ್ಥಿವೇತನ ಹುಡುಕಿ",
    findingButton: "ಅರ್ಹತಾ ನಿಯಮಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...",
    eligibleTitle: "ನಿಮಗಾಗಿ ಲಭ್ಯವಿರುವ ವಿದ್ಯಾರ್ಥಿವೇತನಗಳು",
    allEligibleTab: "ಎಲ್ಲಾ ಫಲಿತಾಂಶಗಳು",
    highlyLikelyTab: "ಹೆಚ್ಚು ಸಂಭವನೀಯತೆ (>=80%)",
    closingSoonTab: "ಶೀಘ್ರ ಮುಕ್ತಾಯ",
    nearMatchTab: "ಹತ್ತಿರದ ಹೊಂದಾಣಿಕೆಗಳು",
    allDirectoryTab: "ಸಮಗ್ರ ಪಟ್ಟಿ",
    checklistTitle: "ಅಗತ್ಯ ದಾಖಲೆಗಳ ಪರಿಶೀಲನಾ ಪಟ್ಟಿ",
    stepsTitle: "ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ವಿಧಾನ",
    printReport: "ವರದಿ ಮುದ್ರಿಸಿ / ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
    applyOfficial: "ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ",
    readAloud: "ಆಡಿಯೋ ಆಲಿಸಿ",
    incomeSliderLabel: "ವಾರ್ಷಿಕ ಕುಟುಂಬದ ಆದಾಯ:"
  },
  ta: {
    heroTitle: "உங்களுக்குத் தகுதியான அனைத்து கல்வி உதவித்தொகைகளையும் கண்டறியுங்கள்",
    heroSubtitle: "ஒற்றை எளிய படிவம். மத்திய, மாநில மற்றும் தனியார் திட்டங்களின் தகுதியை நொடிகளில் அறிந்திடுங்கள்.",
    findButton: "கல்வி உதவித்தொகை தேடுங்கள்",
    findingButton: "தகுதி விதிகள் பகுப்பாய்வு செய்யப்படுகின்றன...",
    eligibleTitle: "உங்களுக்கான உதவித்தொகைகள்",
    allEligibleTab: "அனைத்து பொருத்தங்கள்",
    highlyLikelyTab: "அதிக வாய்ப்பு (>=80%)",
    closingSoonTab: "விரைவில் நிறைவடைகிறது",
    nearMatchTab: "அருகிலுள்ள பொருத்தங்கள்",
    allDirectoryTab: "முழு பட்டியல்",
    checklistTitle: "தேவையான ஆவணங்கள் சரிபார்ப்பு பட்டியல்",
    stepsTitle: "விண்ணப்பிக்கும் முறை",
    printReport: "அறிக்கையை அச்சிடுக / பதிவிறக்குக",
    applyOfficial: "அதிகாரப்பூர்வ போர்ட்டலில் விண்ணப்பிக்கவும்",
    readAloud: "ஒலி வடிவில் கேட்க",
    incomeSliderLabel: "ஆண்டு குடும்ப வருமானம்:"
  },
  te: {
    heroTitle: "మీకు అర్హత ఉన్న ప్రతి స్కాలర్‌షిప్‌ను తక్షణమే కనుగొనండి",
    heroSubtitle: "ఒకే సాధారణ దరఖాస్తు. కేంద్ర, రాష్ట్ర మరియు ప్రైవేట్ పథకాల అర్హతను క్షణాల్లో తెలుసుకోండి.",
    findButton: "స్కాలర్‌షిప్‌లను సరిపోల్చండి",
    findingButton: "అర్హత నిబంధనలను పరిశీలిస్తున్నాము...",
    eligibleTitle: "మీ కోసం సరిపోలిన పథకాలు",
    allEligibleTab: "అన్ని సరిపోలికలు",
    highlyLikelyTab: "ఎక్కువ అవకాశం (>=80%)",
    closingSoonTab: "త్వరలో ముగిసేవి",
    nearMatchTab: "దగ్గరి సరిపోలికలు",
    allDirectoryTab: "మొత్తం డైరెక్టరీ",
    checklistTitle: "అవసరమైన ధృవీకరణ పత్రాల జాబితా",
    stepsTitle: "దరఖాస్తు చేసుకునే విధానం",
    printReport: "నివేదికను ప్రింట్ చేయండి",
    applyOfficial: "అధికారిక పోర్టల్‌లో దరఖాస్తు చేయండి",
    readAloud: "వినండి (ఆడియో)",
    incomeSliderLabel: "వార్షిక కుటుంబ ఆదాయం:"
  }
};

// Application State
let currentLanguage = 'en';
let matchResults = null;
let currentTab = 'all';
let allSchemesDirectory = [];

// Initialize DOM
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLanguage();
  initStudentSession();
  loadDropdownOptions();
  loadAnnouncements();
  setupEventListeners();
  loadDirectory();
});

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

// Student session check
function initStudentSession() {
  const raw = localStorage.getItem('vidyapath_user');
  const badge = document.getElementById('userAuthBadge');
  if (raw && badge) {
    try {
      const user = JSON.parse(raw);
      badge.innerHTML = `
        <span class="badge badge-success" style="font-size:0.8rem; padding:0.35rem 0.65rem;">
          🎓 ${escapeHtml(user.name || user.studentRollNo)} (${escapeHtml(user.institutionName || 'College')})
        </span>
        <button type="button" id="logoutStudentBtn" class="btn btn-secondary" style="font-size:0.75rem; padding:0.25rem 0.5rem;">
          Logout
        </button>
      `;
      document.getElementById('logoutStudentBtn').onclick = () => {
        localStorage.removeItem('vidyapath_user');
        window.location.reload();
      };

      if (user.studentRollNo && document.getElementById('studentName')) {
        document.getElementById('studentName').value = user.name || user.studentRollNo;
      }
      if (user.percentage && document.getElementById('percentage')) {
        document.getElementById('percentage').value = user.percentage;
      }
      if (user.familyIncome && document.getElementById('familyIncome')) {
        document.getElementById('familyIncome').value = user.familyIncome;
        document.getElementById('familyIncomeRange').value = user.familyIncome;
        updateIncomeDisplay();
      }
      if (user.category && document.getElementById('category')) {
        document.getElementById('category').value = user.category;
      }
    } catch (e) {
      console.error(e);
    }
  }
}

// Setup Language
function initLanguage() {
  const savedLang = localStorage.getItem('vidyapath_lang') || 'en';
  setLanguage(savedLang);
}

function setLanguage(lang) {
  if (!i18n[lang]) lang = 'en';
  currentLanguage = lang;
  localStorage.setItem('vidyapath_lang', lang);

  const select = document.getElementById('langSelect');
  if (select) select.value = lang;

  // Apply translations
  const t = i18n[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) {
      el.textContent = t[key];
    }
  });

  updateIncomeDisplay();
}

// Fetch and render live announcements
async function loadAnnouncements() {
  const container = document.getElementById('announcementsGrid');
  if (!container) return;
  try {
    const res = await fetch('/api/announcements');
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      container.innerHTML = '';
      data.data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'announcement-card';
        div.innerHTML = `
          <div>
            <div class="announcement-dept-row">
              <span class="announcement-dept-badge">🏛️ ${escapeHtml(item.departmentCode || item.department || 'National Portal')}</span>
              <span class="announcement-circular-no">${escapeHtml(item.circularNo || '')}</span>
            </div>
            <div class="announcement-top" style="margin-top: 0.4rem;">
              <span class="badge badge-${item.type || 'info'}">${escapeHtml(item.tag)}</span>
              <span class="announcement-date">${escapeHtml(item.date)}</span>
            </div>
            <div class="announcement-title">${escapeHtml(item.title)}</div>
          </div>
          <div class="announcement-summary">${escapeHtml(item.summary)}</div>
          <div class="announcement-footer">
            <span style="color:var(--text-muted); font-size:0.75rem;">Scope: All Colleges & Schools</span>
            <a href="${item.officialUrl || 'https://scholarships.gov.in'}" target="_blank" rel="noopener noreferrer" class="announcement-link">
              Official Notice ↗
            </a>
          </div>
        `;
        container.appendChild(div);
      });
    }
  } catch (err) {
    console.error('Failed to load announcements:', err);
  }
}

// Load dropdown options from backend
async function loadDropdownOptions() {
  try {
    const res = await fetch('/api/options');
    const data = await res.json();
    if (data.success) {
      populateSelect('educationLevel', data.educationLevels);
      populateSelect('stream', data.streams);
      populateSelect('category', data.categories);
      populateSelect('religion', data.religions);
      populateSelect('state', data.states);
    }
  } catch (err) {
    console.error('Error loading options:', err);
  }
}

function populateSelect(elemId, items) {
  const select = document.getElementById(elemId);
  if (!select) return;
  const currentVal = select.value;
  select.innerHTML = '';
  items.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item;
    opt.textContent = item;
    select.appendChild(opt);
  });
  if (currentVal && items.includes(currentVal)) {
    select.value = currentVal;
  }
}

// Setup Event Listeners
function setupEventListeners() {
  // Global Search Bar with Search Button
  const globalSearchBtn = document.getElementById('globalSearchBtn');
  const globalSearchInput = document.getElementById('globalSearchInput');
  if (globalSearchBtn && globalSearchInput) {
    const triggerSearch = () => {
      const q = (globalSearchInput.value || '').trim();
      if (!q) return;
      const resSearch = document.getElementById('resultsSearchInput');
      if (resSearch) resSearch.value = q;
      switchTab('directory');
      const resultsSection = document.getElementById('resultsSection');
      if (resultsSection) {
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
      }
    };
    globalSearchBtn.addEventListener('click', triggerSearch);
    globalSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') triggerSearch();
    });
  }

  // Language select
  const langSelect = document.getElementById('langSelect');
  if (langSelect) {
    langSelect.addEventListener('change', (e) => setLanguage(e.target.value));
  }

  // Income Slider Sync
  const incomeSlider = document.getElementById('familyIncomeRange');
  const incomeInput = document.getElementById('familyIncome');
  if (incomeSlider && incomeInput) {
    incomeSlider.addEventListener('input', (e) => {
      incomeInput.value = e.target.value;
      updateIncomeDisplay();
    });
    incomeInput.addEventListener('input', (e) => {
      incomeSlider.value = e.target.value || 0;
      updateIncomeDisplay();
    });
  }

  // PwD toggle show/hide disability %
  const pwdCheckbox = document.getElementById('isPwd');
  const pwdWrap = document.getElementById('pwdPercentGroup');
  if (pwdCheckbox && pwdWrap) {
    pwdCheckbox.addEventListener('change', (e) => {
      pwdWrap.style.display = e.target.checked ? 'block' : 'none';
    });
  }

  // Main Form Submit
  const form = document.getElementById('matchForm');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }

  // Tabs Click
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      switchTab(tab);
    });
  });

  // Filter inside results
  const resultSearch = document.getElementById('resultsSearchInput');
  if (resultSearch) {
    resultSearch.addEventListener('input', () => filterAndRenderCards());
  }

  const resultTypeFilter = document.getElementById('resultsTypeFilter');
  if (resultTypeFilter) {
    resultTypeFilter.addEventListener('change', () => filterAndRenderCards());
  }

  // Modal Close
  const closeBtn = document.getElementById('modalCloseBtn');
  const modalOverlay = document.getElementById('detailsModal');
  if (closeBtn && modalOverlay) {
    closeBtn.addEventListener('click', () => modalOverlay.style.display = 'none');
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.style.display = 'none';
    });
  }

  // Print button
  const printBtn = document.getElementById('printReportBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }
}

function updateIncomeDisplay() {
  const incomeInput = document.getElementById('familyIncome');
  const display = document.getElementById('incomeFormatted');
  if (incomeInput && display) {
    const val = Number(incomeInput.value) || 0;
    display.textContent = '₹' + val.toLocaleString('en-IN');
  }
}

// Handle Form Submission
async function handleFormSubmit(e) {
  e.preventDefault();

  const profile = {
    name: document.getElementById('studentName').value,
    institutionCategory: document.getElementById('institutionCategory')?.value || 'All Recognized Colleges & Universities (AISHE Accredited)',
    educationLevel: document.getElementById('educationLevel').value,
    stream: document.getElementById('stream').value,
    percentage: Number(document.getElementById('percentage').value),
    familyIncome: Number(document.getElementById('familyIncome').value),
    gender: document.getElementById('gender').value,
    category: document.getElementById('category').value,
    religion: document.getElementById('religion').value,
    state: document.getElementById('state').value,
    isPwd: document.getElementById('isPwd').checked,
    disabilityPercentage: Number(document.getElementById('disabilityPercentage').value || 0),
    isSingleGirlChild: document.getElementById('isSingleGirlChild').checked,
    isWardOfDefense: document.getElementById('isWardOfDefense').checked,
    isRural: document.getElementById('isRural').checked
  };

  // Show Loading state
  const loadingIndicator = document.getElementById('loadingIndicator');
  const resultsSection = document.getElementById('resultsSection');
  const submitBtn = document.getElementById('matchSubmitBtn');

  loadingIndicator.style.display = 'block';
  resultsSection.style.display = 'none';
  submitBtn.disabled = true;

  try {
    const res = await fetch('/api/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });

    const data = await res.json();
    if (data.success) {
      matchResults = data.data;
      renderAnalyticsRibbon(matchResults);
      updateTabBadges(matchResults);
      switchTab('all');

      loadingIndicator.style.display = 'none';
      resultsSection.style.display = 'block';
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      alert('Error matching: ' + (data.error || 'Server error'));
      loadingIndicator.style.display = 'none';
    }
  } catch (err) {
    console.error('Match failed:', err);
    alert('Failed to connect to scholarship server.');
    loadingIndicator.style.display = 'none';
  } finally {
    submitBtn.disabled = false;
  }
}

function renderAnalyticsRibbon(results) {
  const countEl = document.getElementById('eligibleCountVal');
  const aidEl = document.getElementById('potentialAidVal');
  const topScoreEl = document.getElementById('topScoreVal');
  const nearCountEl = document.getElementById('nearCountVal');

  if (countEl) countEl.textContent = results.counts.eligibleCount;
  if (aidEl) aidEl.textContent = '₹' + results.totalPotentialFinancialAid.toLocaleString('en-IN');

  const topScore = results.eligible.length > 0 ? results.eligible[0].matchingDetails.score + '%' : 'N/A';
  if (topScoreEl) topScoreEl.textContent = topScore;
  if (nearCountEl) nearCountEl.textContent = results.counts.nearMatchCount;
}

function updateTabBadges(results) {
  document.getElementById('badgeAll').textContent = results.counts.eligibleCount;

  const highlyLikelyCount = results.eligible.filter(s => s.matchingDetails.score >= 80).length;
  document.getElementById('badgeHighlyLikely').textContent = highlyLikelyCount;

  const closingSoonCount = results.eligible.filter(s => s.matchingDetails.isClosingSoon).length;
  document.getElementById('badgeClosingSoon').textContent = closingSoonCount;

  document.getElementById('badgeNear').textContent = results.counts.nearMatchCount;
  document.getElementById('badgeDirectory').textContent = allSchemesDirectory.length;
}

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
  });
  filterAndRenderCards();
}

function filterAndRenderCards() {
  const container = document.getElementById('schemesGrid');
  if (!container) return;
  container.innerHTML = '';

  let list = [];
  if (currentTab === 'all') {
    list = matchResults?.eligible || [];
  } else if (currentTab === 'likely') {
    list = (matchResults?.eligible || []).filter(s => s.matchingDetails.score >= 80);
  } else if (currentTab === 'closing') {
    list = (matchResults?.eligible || []).filter(s => s.matchingDetails.isClosingSoon);
  } else if (currentTab === 'near') {
    list = matchResults?.nearMatches || [];
  } else if (currentTab === 'directory') {
    list = allSchemesDirectory;
  }

  // Secondary text search filter
  const query = (document.getElementById('resultsSearchInput')?.value || '').toLowerCase();
  const typeFilter = document.getElementById('resultsTypeFilter')?.value || 'All';

  if (query) {
    list = list.filter(s =>
      s.name.toLowerCase().includes(query) ||
      s.provider.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query)
    );
  }

  if (typeFilter !== 'All') {
    list = list.filter(s => s.category_type === typeFilter);
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
        <h3>No scholarships found matching this filter criteria</h3>
        <p>Try switching tabs or resetting your search filter.</p>
      </div>
    `;
    return;
  }

  list.forEach(scheme => {
    const card = createSchemeCard(scheme);
    container.appendChild(card);
  });
}

function createSchemeCard(scheme) {
  const m = scheme.matchingDetails || {
    score: 70,
    status: 'directory',
    tags: [{ label: scheme.category_type, type: 'neutral' }]
  };

  const card = document.createElement('div');
  card.className = `scheme-card ${m.status === 'eligible' ? 'border-accent' : m.status === 'near_match' ? 'border-warning' : ''}`;

  // Tag badges
  const tagsHtml = (m.tags || []).map(t => {
    return `<span class="badge badge-${t.type || 'info'}">${escapeHtml(t.label)}</span>`;
  }).join(' ');

  // Fill class based on score
  const fillClass = m.score >= 80 ? 'fill-high' : m.score >= 65 ? 'fill-med' : 'fill-warn';

  // Check passed checks / failure highlights
  let diagnosticSnippet = '';
  if (m.status === 'eligible') {
    diagnosticSnippet = `
      <div class="diagnostic-item"><span style="color:var(--accent-success);">✔</span> Meets academic, income & demographic criteria</div>
    `;
  } else if (m.status === 'near_match' && m.failedChecks?.length > 0) {
    diagnosticSnippet = `
      <div class="diagnostic-item" style="color:var(--accent-warning);"><span style="font-weight:bold;">⚠</span> ${escapeHtml(m.failedChecks[0].message)}</div>
    `;
  }

  card.innerHTML = `
    <div class="card-top">
      <div class="card-tags">${tagsHtml}</div>
      <h3 class="card-title">${escapeHtml(scheme.name)}</h3>
      <div class="card-provider">
        <span>🏛️</span> ${escapeHtml(scheme.provider)}
      </div>

      <div class="card-amount-banner">
        <div>
          <div class="amount-label">Award Value</div>
          <div class="amount-val">${escapeHtml(scheme.award_amount || 'Financial Aid')}</div>
        </div>
        <div style="text-align: right;">
          <div class="amount-label">Deadline</div>
          <div style="font-weight: 700; font-size: 0.85rem;">${escapeHtml(scheme.deadline || 'Ongoing')}</div>
        </div>
      </div>

      <div class="match-bar-wrap">
        <div class="match-bar-header">
          <span>Match Confidence</span>
          <span>${m.score}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill ${fillClass}" style="width: ${m.score}%;"></div>
        </div>
      </div>

      <div class="diagnostic-chips">
        ${diagnosticSnippet}
      </div>
    </div>

    <div class="card-actions">
      <button class="btn btn-secondary btn-details" type="button">Checklist & Details</button>
      <a href="${escapeHtml(scheme.official_url)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Apply Now ↗</a>
    </div>
  `;

  card.querySelector('.btn-details').addEventListener('click', () => {
    openSchemeModal(scheme);
  });

  return card;
}

// Open Details & Dynamic Checklist Modal
function openSchemeModal(scheme) {
  const modal = document.getElementById('detailsModal');
  const title = document.getElementById('modalSchemeTitle');
  const provider = document.getElementById('modalSchemeProvider');
  const desc = document.getElementById('modalSchemeDesc');
  const stepsContainer = document.getElementById('modalStepsList');
  const checklistContainer = document.getElementById('modalChecklist');
  const officialLink = document.getElementById('modalOfficialLink');
  const speechBtn = document.getElementById('modalSpeechBtn');

  title.textContent = scheme.name;
  provider.textContent = scheme.provider;
  desc.textContent = scheme.description;
  officialLink.href = scheme.official_url;

  // Render Steps
  stepsContainer.innerHTML = '';
  (scheme.steps_to_apply || []).forEach((step, idx) => {
    const item = document.createElement('div');
    item.className = 'step-item';
    item.innerHTML = `
      <div class="step-num">${idx + 1}</div>
      <div style="font-size: 0.9rem;">${escapeHtml(step)}</div>
    `;
    stepsContainer.appendChild(item);
  });

  // Render Tailored Checklist
  checklistContainer.innerHTML = '';
  const docs = scheme.matchingDetails?.tailoredDocuments || (scheme.required_documents || []).map(d => ({
    name: d,
    category: 'Required Document',
    notes: 'Required for official verification.'
  }));

  docs.forEach((doc, idx) => {
    const row = document.createElement('label');
    row.className = 'checklist-row';
    row.innerHTML = `
      <input type="checkbox" id="doc_check_${idx}">
      <div>
        <div class="checklist-title">${escapeHtml(doc.name)} <span class="badge badge-neutral" style="font-size:0.65rem;">${escapeHtml(doc.category)}</span></div>
        <div class="checklist-notes">${escapeHtml(doc.notes)}</div>
      </div>
    `;
    checklistContainer.appendChild(row);
  });

  // Setup Audio Speech
  speechBtn.onclick = () => {
    speakSchemeSummary(scheme);
  };

  // College Application Submission
  const applyCollegeBtn = document.getElementById('modalApplyCollegeBtn');
  if (applyCollegeBtn) {
    applyCollegeBtn.onclick = async () => {
      const rawUser = localStorage.getItem('vidyapath_user');
      if (!rawUser) {
        if (confirm('Please log in with your respective College / School ID to submit this application to your Nodal Officer. Would you like to log in now?')) {
          window.location.href = '/login.html';
        }
        return;
      }

      const user = JSON.parse(rawUser);
      applyCollegeBtn.disabled = true;
      applyCollegeBtn.textContent = 'Submitting to College Nodal Officer...';

      try {
        const payload = {
          schemeId: scheme.id,
          schemeName: scheme.name,
          studentId: user.id,
          studentName: user.name || user.studentRollNo,
          studentRollNo: user.studentRollNo,
          institutionId: user.institutionId,
          institutionName: user.institutionName,
          course: user.educationLevel || document.getElementById('educationLevel')?.value || 'Undergraduate Degree',
          category: user.category || document.getElementById('category')?.value || 'General',
          familyIncome: user.familyIncome || document.getElementById('familyIncome')?.value || 200000,
          percentage: user.percentage || document.getElementById('percentage')?.value || 75.0,
          awardAmount: scheme.award_amount || 'Tuition Assistance',
          documents: user.documents || {
            aadhaar: { verified: true, docNo: 'XXXXXXXX8921', name: 'Aadhaar_Document.pdf' },
            caste: { verified: true, docNo: 'RD-DIGITAL-VERIFIED', name: 'Caste_Certificate.pdf' },
            income: { verified: true, docNo: 'RD-INCOME-VERIFIED', name: 'Income_Certificate.pdf' },
            photo: { verified: true, name: 'Passport_Photo.jpg', previewUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
            biometric: { verified: true, method: 'UIDAI Face-RD / Biometric e-KYC' }
          }
        };

        const res = await fetch('/api/applications/apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (data.success) {
          alert(`🎉 Success! Application (${data.application.id}) submitted to ${user.institutionName}!\n\nYour College Nodal Officer can now inspect your original documents (Aadhaar, Caste, Income, Photo, Biometric e-KYC) and e-attest your application directly.`);
          applyCollegeBtn.textContent = '✅ Submitted to College Nodal Officer';
          applyCollegeBtn.style.background = 'var(--accent-success)';
        } else {
          alert(data.error || 'Failed to submit application.');
          applyCollegeBtn.disabled = false;
          applyCollegeBtn.textContent = 'Apply & Submit to College Nodal Officer';
        }
      } catch (err) {
        alert('Failed to connect to application server.');
        applyCollegeBtn.disabled = false;
        applyCollegeBtn.textContent = 'Apply & Submit to College Nodal Officer';
      }
    };
  }

  modal.style.display = 'flex';
}

// Audio Read Aloud using SpeechSynthesis API
function speakSchemeSummary(scheme) {
  if (!('speechSynthesis' in window)) {
    alert('Text to speech is not supported in this browser.');
    return;
  }

  window.speechSynthesis.cancel(); // Stop any ongoing speech

  const textToRead = `${scheme.name}. Offered by ${scheme.provider}. Award value is ${scheme.award_amount}. Application deadline is ${scheme.deadline}. Summary: ${scheme.description}`;

  const utterance = new SpeechSynthesisUtterance(textToRead);
  utterance.rate = 0.95;

  // Pick voice based on current language if available
  const voices = window.speechSynthesis.getVoices();
  const langPrefix = currentLanguage === 'hi' ? 'hi' : currentLanguage === 'kn' ? 'kn' : currentLanguage === 'ta' ? 'ta' : currentLanguage === 'te' ? 'te' : 'en';
  const matchingVoice = voices.find(v => v.lang.startsWith(langPrefix));
  if (matchingVoice) utterance.voice = matchingVoice;

  window.speechSynthesis.speak(utterance);
}

// Load All Schemes for the Directory Tab
async function loadDirectory() {
  try {
    const res = await fetch('/api/schemes');
    const data = await res.json();
    if (data.success) {
      allSchemesDirectory = data.data;
    }
  } catch (err) {
    console.error('Failed to load directory:', err);
  }
}

// Utility: escape HTML
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
