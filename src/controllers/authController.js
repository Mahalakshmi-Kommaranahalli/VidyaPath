/**
 * Auth Controller
 * Handles institutional login endpoints for Students and College Nodal Officers
 */

const authService = require('../services/authService');

const authController = {
  getInstitutions: (req, res) => {
    try {
      const institutions = authService.getInstitutions();
      return res.json({ success: true, data: institutions });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  studentLogin: (req, res) => {
    try {
      const { institutionId, studentRollNo, password } = req.body;
      if (!institutionId || !studentRollNo) {
        return res.status(400).json({ success: false, error: 'Both Institution and Student Roll Number / USN are required.' });
      }

      const result = authService.loginStudent(institutionId, studentRollNo, password);
      if (!result.success) {
        return res.status(401).json(result);
      }
      return res.json(result);
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  officerLogin: (req, res) => {
    try {
      const { institutionId, password } = req.body;
      if (!institutionId) {
        return res.status(400).json({ success: false, error: 'Institution selection is required.' });
      }

      const result = authService.loginOfficer(institutionId, password);
      if (!result.success) {
        return res.status(401).json(result);
      }
      return res.json(result);
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
};

module.exports = authController;
