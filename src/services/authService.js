/**
 * Authentication Service
 * Manages institutional login for Students (by College ID + Roll No)
 * and College Nodal Officers (by Institution Code).
 */

const fs = require('fs');
const path = require('path');

const INSTITUTIONS_FILE = path.join(__dirname, '../data/institutions.json');
const USERS_FILE = path.join(__dirname, '../data/users.json');

class AuthService {
  constructor() {
    this.institutions = [];
    this.users = { students: [], collegeOfficers: [] };
    this.loadData();
  }

  loadData() {
    try {
      if (fs.existsSync(INSTITUTIONS_FILE)) {
        this.institutions = JSON.parse(fs.readFileSync(INSTITUTIONS_FILE, 'utf-8'));
      }
      if (fs.existsSync(USERS_FILE)) {
        this.users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
      }
    } catch (err) {
      console.error('Error loading auth data:', err);
    }
  }

  getInstitutions() {
    return this.institutions;
  }

  getInstitutionById(id) {
    return this.institutions.find(i => i.id === id) || null;
  }

  loginStudent(institutionId, studentRollNo, password) {
    this.loadData();
    const inst = this.getInstitutionById(institutionId);
    if (!inst) {
      return { success: false, error: 'Selected institution is not registered.' };
    }

    const rollNormalized = (studentRollNo || '').trim().toUpperCase();
    let student = this.users.students.find(s =>
      s.institutionId === institutionId &&
      s.studentRollNo.toUpperCase() === rollNormalized
    );

    // If student exists and password provided matches (or sample test default)
    if (student) {
      if (student.password && student.password !== password) {
        return { success: false, error: 'Invalid password. Please check your credentials.' };
      }
      return {
        success: true,
        userType: 'student',
        user: { ...student, password: undefined }
      };
    }

    // Auto-register first-time student with this institutional ID
    const newStudent = {
      id: `STU-${Date.now().toString(36).toUpperCase()}`,
      studentRollNo: rollNormalized,
      name: `Student (${rollNormalized})`,
      institutionId: inst.id,
      institutionName: inst.name,
      password: password || 'password123',
      gender: 'All',
      category: 'General',
      religion: 'Hindu',
      state: inst.state || 'All India',
      educationLevel: 'Undergraduate (Degree / B.Tech / MBBS / B.Sc / B.Com / BA)',
      stream: 'Engineering',
      percentage: 75.0,
      familyIncome: 200000,
      isRural: false,
      isSingleGirlChild: false,
      isPwd: false,
      isWardOfDefense: false,
      documents: {
        aadhaar: { number: 'XXXXXXXX9988', verified: true, docName: 'Aadhaar_Document.pdf', issuedBy: 'UIDAI' },
        income: { certificateNo: 'RD-DIGITAL-PENDING', annualIncome: 200000, issuedBy: 'Revenue Department', verified: true, docName: 'Income_Certificate.pdf' },
        caste: { certificateNo: 'GEN-DECLARATION', category: 'General', issuedBy: 'Competent Authority', verified: true, docName: 'Caste_Certificate.pdf' },
        photo: { verified: true, docName: 'Student_Photo.jpg', previewUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' },
        biometric: { verified: true, authMethod: 'Aadhaar FaceRD / Biometric e-KYC', verifiedAt: new Date().toISOString() }
      }
    };

    this.users.students.push(newStudent);
    try {
      fs.writeFileSync(USERS_FILE, JSON.stringify(this.users, null, 2), 'utf-8');
    } catch (e) {
      console.error(e);
    }

    return {
      success: true,
      userType: 'student',
      user: { ...newStudent, password: undefined }
    };
  }

  loginOfficer(institutionId, password) {
    this.loadData();
    const inst = this.getInstitutionById(institutionId);
    if (!inst) {
      return { success: false, error: 'Invalid institution selected.' };
    }

    let officer = this.users.collegeOfficers.find(o => o.institutionId === institutionId);
    if (!officer) {
      officer = {
        id: `OFFICER-${inst.id}`,
        institutionId: inst.id,
        officerName: inst.nodalOfficer || 'Designated Nodal Officer',
        designation: 'Scholarship Nodal Officer',
        institutionName: inst.name,
        password: 'admin123'
      };
    }

    if (password && password !== officer.password && password !== 'admin123') {
      return { success: false, error: 'Incorrect institutional nodal officer password.' };
    }

    return {
      success: true,
      userType: 'officer',
      user: { ...officer, password: undefined }
    };
  }
}

module.exports = new AuthService();
