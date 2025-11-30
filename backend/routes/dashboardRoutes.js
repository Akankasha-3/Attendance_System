const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const dashboardController = require('../controllers/dashboardController');

router.get('/employee', authenticate, dashboardController.getEmployeeDashboard);
router.get('/manager', authenticate, dashboardController.getManagerDashboard);

module.exports = router;
