const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createUrl, getAllUrls, deleteUrl, updateUrl, bulkCreateUrls } = require('../controllers/urlController');

router.post('/create', authMiddleware, createUrl);
router.get('/all', authMiddleware, getAllUrls);
router.delete('/:id', authMiddleware, deleteUrl);
router.put('/:id', authMiddleware, updateUrl);
router.post('/bulk', authMiddleware, bulkCreateUrls);

module.exports = router;
