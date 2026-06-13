const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getAnalytics, getPublicStats } = require('../controllers/analyticsController');

router.get('/:id', authMiddleware, getAnalytics);

module.exports = router;
