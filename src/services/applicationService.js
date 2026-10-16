/**
 * Application Service
 * Manages scholarship applications submitted by students to their colleges,
 * original document attachments, and college verification workflows.
 */

const fs = require('fs');
const path = require('path');

const APPLICATIONS_FILE = path.join(__dirname, '../data/applications.json');

class ApplicationService {
  constructor() {
    this.applications = [];
    this.loadApplications();
  }

  loadApplications() {
    try {
      if (fs.existsSync(APPLICATIONS_FILE)) {
        this.applications = JSON.parse(fs.readFileSync(APPLICATIONS_FILE, 'utf-8'));
      } else {
        this.applications = [];
      }
    } catch (err) {
      console.error('Error loading applications:', err);
      this.applications = [];
    }
  }

  saveApplications() {
    try {
      fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify(this.applications, null, 2), 'utf-8');
      return true;
    } catch (err) {
      console.error('Error saving applications:', err);
      return false;
    }
  }

  createApplication(data) {
    this.loadApplications();

    // Check if already applied for this scheme by this student
    const existing = this.applications.find(a =>
      a.studentId === data.studentId &&
      a.schemeId === data.schemeId
    );
    if (existing) {
      return { success: false, error: 'You have already submitted an application for this scholarship scheme.', existing };
    }

    const newApp = {
      id: `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      schemeId: data.schemeId,
      schemeName: data.schemeName,
      studentId: data.studentId,
      studentName: data.studentName || 'Student',
      studentRollNo: data.studentRollNo,
      institutionId: data.institutionId,
      institutionName: data.institutionName,
      course: data.course || 'Undergraduate Degree',
      category: data.category || 'General',
      familyIncome: Number(data.familyIncome) || 0,
      percentage: Number(data.percentage) || 0,
      awardAmount: data.awardAmount || 'Fee Reimbursement',
      appliedAt: new Date().toISOString(),
      status: 'Pending College Verification',
      documents: data.documents || {
        aadhaar: { verified: true, docNo: 'XXXXXXXX8921', name: 'Aadhaar_Card_Verified.pdf' },
        caste: { verified: true, docNo: 'RD-VERIFIED', name: 'Caste_Certificate.pdf' },
        income: { verified: true, docNo: 'RD-INCOME-VERIFIED', name: 'Income_Certificate.pdf' },
        photo: { verified: true, name: 'Passport_Photo.jpg', previewUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
        biometric: { verified: true, method: 'UIDAI Face-RD / Biometric e-KYC' }
      },
      collegeVerification: {
        verifiedBy: null,
        verifiedAt: null,
        remarks: 'Application under scrutiny by College Nodal Officer'
      }
    };

    this.applications.unshift(newApp);
    this.saveApplications();
    return { success: true, application: newApp };
  }

  getByStudent(studentId) {
    this.loadApplications();
    return this.applications.filter(a => a.studentId === studentId);
  }

  getByCollege(institutionId) {
    this.loadApplications();
    return this.applications.filter(a => a.institutionId === institutionId);
  }

  getById(applicationId) {
    this.loadApplications();
    return this.applications.find(a => a.id === applicationId) || null;
  }

  verifyApplication(applicationId, officerName, status, remarks) {
    this.loadApplications();
    const app = this.applications.find(a => a.id === applicationId);
    if (!app) {
      return { success: false, error: 'Application not found' };
    }

    app.status = status; // e.g. "Verified & Approved by College" or "Rejected / Sent Back for Correction"
    app.collegeVerification = {
      verifiedBy: officerName,
      verifiedAt: new Date().toISOString(),
      remarks: remarks || 'Documents verified against institutional student register.'
    };

    this.saveApplications();
    return { success: true, application: app };
  }

  getCollegeStats(institutionId) {
    const list = this.getByCollege(institutionId);
    return {
      totalReceived: list.length,
      pending: list.filter(a => a.status === 'Pending College Verification').length,
      approved: list.filter(a => a.status.includes('Approved')).length,
      rejected: list.filter(a => a.status.includes('Rejected')).length
    };
  }
}

module.exports = new ApplicationService();
