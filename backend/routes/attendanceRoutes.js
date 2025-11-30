const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const attendanceController = require('../controllers/attendanceController');

// Employee routes
router.post('/checkin', authenticate, attendanceController.checkIn);
router.post('/checkout', authenticate, attendanceController.checkOut);
router.get('/my-history', authenticate, attendanceController.getMyHistory);
router.get('/my-summary', authenticate, attendanceController.getMySummary);
router.get('/today', authenticate, attendanceController.getTodayStatus);

// Manager routes
router.get('/all', authenticate, authorize(['manager']), attendanceController.getAllEmployees);
router.get(
  '/employee/:id',
  authenticate,
  authorize(['manager']),
  attendanceController.getEmployeeAttendance
);
router.get('/summary', authenticate, authorize(['manager']), attendanceController.getSummary);
router.get(
  '/today-status',
  authenticate,
  authorize(['manager']),
  attendanceController.getTodayStatus
);
router.get('/export', authenticate, authorize(['manager']), attendanceController.exportCSV);

module.exports = router;
