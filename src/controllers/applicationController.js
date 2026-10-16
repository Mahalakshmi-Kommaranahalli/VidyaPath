/**
 * Application Controller
 * Handles student scholarship application submissions and college verification workflows
 */

const applicationService = require('../services/applicationService');

const applicationController = {
  submitApplication: (req, res) => {
    try {
      const data = req.body;
      if (!data.schemeId || !data.studentId || !data.institutionId) {
        return res.status(400).json({ success: false, error: 'schemeId, studentId, and institutionId are required.' });
      }

      const result = applicationService.createApplication(data);
      if (!result.success) {
        return res.status(409).json(result);
      }
      return res.status(201).json(result);
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  getStudentApplications: (req, res) => {
    try {
      const { studentId } = req.params;
      const apps = applicationService.getByStudent(studentId);
      return res.json({ success: true, count: apps.length, data: apps });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  getCollegeApplications: (req, res) => {
    try {
      const { institutionId } = req.params;
      const apps = applicationService.getByCollege(institutionId);
      const stats = applicationService.getCollegeStats(institutionId);
      return res.json({ success: true, count: apps.length, stats, data: apps });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  verifyApplication: (req, res) => {
    try {
      const { id } = req.params;
      const { officerName, status, remarks } = req.body;
      if (!status) {
        return res.status(400).json({ success: false, error: 'Verification status is required.' });
      }

      const result = applicationService.verifyApplication(id, officerName, status, remarks);
      if (!result.success) {
        return res.status(404).json(result);
      }
      return res.json(result);
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
};

module.exports = applicationController;
