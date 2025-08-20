const express = require('express');
const { verifyToken } = require('../middleware/verifyToken');
const { requireAdmin } = require('../middleware/roleMiddleware');
const { getAll } = require('../controllers/ordersControllers');
const router = express.Router();

router.get('/getAll', verifyToken, requireAdmin, getAll)

module.exports = router;