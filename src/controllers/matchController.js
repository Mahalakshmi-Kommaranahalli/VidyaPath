/**
 * Match Controller
 * Handles request validation, matching invocations, and scheme management APIs.
 */

const schemeService = require('../services/schemeService');
const MatchingEngine = require('../services/matchingEngine');

const matchController = {
  // Main matchmaking endpoint
  matchProfile: (req, res) => {
    try {
      const studentProfile = req.body;

      if (!studentProfile) {
        return res.status(400).json({ error: 'Student profile payload is required' });
      }

      // Basic validation
      if (!studentProfile.educationLevel) {
        return res.status(400).json({ error: 'educationLevel is required' });
      }

      const allSchemes = schemeService.getAll();
      const matchResult = MatchingEngine.match(studentProfile, allSchemes);

      return res.json({
        success: true,
        data: matchResult
      });
    } catch (err) {
      console.error('Error during profile match:', err);
      return res.status(500).json({
        success: false,
        error: 'An unexpected error occurred while matching scholarships.'
      });
    }
  },

  // Get all schemes with optional query filters
  getSchemes: (req, res) => {
    try {
      const filters = {
        search: req.query.search,
        category_type: req.query.category_type,
        state: req.query.state,
        education_level: req.query.education_level
      };
      const schemes = schemeService.getAll(filters);
      return res.json({
        success: true,
        count: schemes.length,
        data: schemes
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // Get single scheme by ID
  getSchemeById: (req, res) => {
    try {
      const scheme = schemeService.getById(req.params.id);
      if (!scheme) {
        return res.status(404).json({ success: false, error: 'Scholarship scheme not found' });
      }
      return res.json({ success: true, data: scheme });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // Admin: Create a new scholarship scheme
  createScheme: (req, res) => {
    try {
      const { name, provider, category_type, award_amount, criteria } = req.body;
      if (!name || !provider || !criteria) {
        return res.status(400).json({ success: false, error: 'Name, provider, and criteria are required fields.' });
      }
      const created = schemeService.create(req.body);
      return res.status(201).json({ success: true, data: created });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // Admin: Update a scholarship scheme
  updateScheme: (req, res) => {
    try {
      const updated = schemeService.update(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Scheme not found to update' });
      }
      return res.json({ success: true, data: updated });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // Admin: Delete a scholarship scheme
  deleteScheme: (req, res) => {
    try {
      const success = schemeService.delete(req.params.id);
      if (!success) {
        return res.status(404).json({ success: false, error: 'Scheme not found to delete' });
      }
      return res.json({ success: true, message: 'Scheme deleted successfully' });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // Get portal and scheme statistics
  getStats: (req, res) => {
    try {
      const stats = schemeService.getStats();
      return res.json({ success: true, data: stats });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // Get live scholarship portal announcements & deadline alerts
  getAnnouncements: (req, res) => {
    return res.json({
      success: true,
      data: [
        {
          id: "ANN-001",
          department: "Ministry of Education & National Scholarship Portal",
          departmentCode: "MoE / NSP",
          circularNo: "MoE/NSP-OTR/2026/F-102",
          tag: "MANDATORY ACTION",
          type: "danger",
          title: "Aadhaar Face-RD Biometric e-KYC & One-Time Registration (OTR) Open for AY 2026-27",
          date: "Active Window | All Colleges & Schools",
          summary: "As notified by the Ministry of Education, all students enrolled in recognized schools, polytechnics, and colleges across India must complete Face-RD / Aadhaar biometric e-KYC. Mandatory for direct benefit transfer (DBT) disbursement.",
          officialUrl: "https://scholarships.gov.in"
        },
        {
          id: "ANN-002",
          department: "University Grants Commission (UGC)",
          departmentCode: "UGC",
          circularNo: "UGC/F.1-2/2026(CPP-II)",
          tag: "PORTAL OPEN",
          type: "info",
          title: "UGC Ishan Uday & PG Indira Gandhi Single Girl Child Scholarships Live",
          date: "Deadline: Dec 31, 2026",
          summary: "University Grants Commission invites online applications from all UGC-recognized universities, autonomous institutes, and colleges for Ishan Uday Special Scheme (₹7,800/mo) and Single Girl Child PG Fellowship.",
          officialUrl: "https://www.ugc.gov.in"
        },
        {
          id: "ANN-003",
          department: "All India Council for Technical Education (AICTE)",
          departmentCode: "AICTE",
          circularNo: "AICTE/Advt/St-Dev/Pragati-Saksham/2026-27",
          tag: "DEADLINE EXTENDED",
          type: "warning",
          title: "AICTE Pragati (Girls) & Saksham (Differently-Abled) 2026-27 Window Extended",
          date: "Extended Deadline: Nov 30, 2026",
          summary: "Annual grant of ₹50,000 per annum for 1st year degree and diploma students admitted to AICTE approved technical and polytechnic colleges across India.",
          officialUrl: "https://www.aicte-india.org"
        },
        {
          id: "ANN-004",
          department: "Central Board of Secondary Education (CBSE)",
          departmentCode: "CBSE",
          circularNo: "CBSE/Scholarship/SGC/2026/184",
          tag: "ACTIVE SCHEME",
          type: "success",
          title: "CBSE Merit Scholarship Scheme for Single Girl Child 2026 (Class 10 to 12)",
          date: "Deadline: Dec 15, 2026",
          summary: "Scholarship of ₹6,000/year for single girl children who passed Class 10 from any recognized school with 60%+ marks and continuing in Class 11-12.",
          officialUrl: "https://www.cbse.gov.in"
        },
        {
          id: "ANN-005",
          department: "Ministry of Social Justice & Empowerment (MSJE)",
          departmentCode: "MSJE",
          circularNo: "MSJE/SCD-V/Top-Class/2026",
          tag: "PREMIER SCHEME",
          type: "accent",
          title: "Top Class Education Scheme for SC/EBC Students - Full Fee + Living Grant",
          date: "Active AY 2026-27",
          summary: "100% full tuition fee, computer allowance (₹45,000 one-time), and living expenses for meritorious SC/EBC scholars studying in notified institutions across India.",
          officialUrl: "https://socialjustice.gov.in"
        },
        {
          id: "ANN-006",
          department: "Ministry of Tribal Affairs & Minority Affairs",
          departmentCode: "MoTA / MoMA",
          circularNo: "MoTA-MoMA/Joint-Gazette/2026/77",
          tag: "OVERSEAS & FELLOWSHIP",
          type: "info",
          title: "National Overseas Scholarship & Post-Matric Minority Schemes Notified",
          date: "Active for All Recognized Institutions",
          summary: "Full financial coverage for Masters & PhD programs in Top 500 QS global institutions, alongside post-matric financial grants for ST, Muslim, Christian, Sikh, Buddhist, Jain & Parsi students.",
          officialUrl: "https://tribal.nic.in"
        }
      ]
    });
  },

  // Get filter and option lists for dropdowns
  getOptions: (req, res) => {
    return res.json({
      success: true,
      educationLevels: [
        'Class 10 (Secondary / Pre-Matric)',
        'Class 11-12 (Higher Secondary / PUC)',
        'ITI / Vocational',
        'Diploma / Polytechnic',
        'Undergraduate (Degree / B.Tech / MBBS / B.Sc / B.Com / BA)',
        'Postgraduate (Master\'s / M.Tech / MD / M.Sc / MBA / MA)',
        'PhD / Doctoral Research',
        'Study Abroad / National Overseas'
      ],
      streams: [
        'Any',
        'Engineering',
        'Medical',
        'Science',
        'Commerce',
        'Arts/Humanities',
        'Law',
        'Technical',
        'Management'
      ],
      categories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      religions: [
        'Hindu',
        'Muslim',
        'Christian',
        'Sikh',
        'Buddhist',
        'Jain',
        'Parsi',
        'Other'
      ],
      states: [
        'All India',
        'Andhra Pradesh',
        'Arunachal Pradesh',
        'Assam',
        'Bihar',
        'Chhattisgarh',
        'Delhi',
        'Goa',
        'Gujarat',
        'Haryana',
        'Himachal Pradesh',
        'Jammu and Kashmir',
        'Jharkhand',
        'Karnataka',
        'Kerala',
        'Ladakh',
        'Madhya Pradesh',
        'Maharashtra',
        'Manipur',
        'Meghalaya',
        'Mizoram',
        'Nagaland',
        'Odisha',
        'Punjab',
        'Rajasthan',
        'Sikkim',
        'Tamil Nadu',
        'Telangana',
        'Tripura',
        'Uttar Pradesh',
        'Uttarakhand',
        'West Bengal'
      ]
    });
  }
};

module.exports = matchController;
