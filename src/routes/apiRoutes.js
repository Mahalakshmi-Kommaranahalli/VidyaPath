/**
 * API Routes for VidyaPath
 */

const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const authController = require('../controllers/authController');
const applicationController = require('../controllers/applicationController');

// Institutional Auth endpoints
router.get('/auth/institutions', authController.getInstitutions);
router.post('/auth/student/login', authController.studentLogin);
router.post('/auth/officer/login', authController.officerLogin);

// Application & College Verification endpoints
router.post('/applications/apply', applicationController.submitApplication);
router.get('/applications/student/:studentId', applicationController.getStudentApplications);
router.get('/applications/college/:institutionId', applicationController.getCollegeApplications);
router.post('/applications/:id/verify', applicationController.verifyApplication);

// Student matching & schemes endpoints
router.post('/match', matchController.matchProfile);
router.get('/schemes', matchController.getSchemes);
router.get('/schemes/:id', matchController.getSchemeById);
router.get('/stats', matchController.getStats);
router.get('/options', matchController.getOptions);
router.get('/announcements', matchController.getAnnouncements);

// Admin scheme management endpoints
router.post('/admin/schemes', matchController.createScheme);
router.put('/admin/schemes/:id', matchController.updateScheme);
router.delete('/admin/schemes/:id', matchController.deleteScheme);

module.exports = router;
