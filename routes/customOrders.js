const express = require('express');
const router = express.Router();
const CustomOrderController = require('../controllers/CustomOrderController');
const multer = require('multer');
const { authenticate, authorize  } = require('../middleware/authmiddleware');
const upload = multer({ dest: 'uploads/' });

router.post('/',authenticate, authorize('super_admin', 'admin'),  upload.array('images', 5), CustomOrderController.createOrder);
router.get('/', authenticate, authorize('super_admin', 'admin'), CustomOrderController.listOrders);
router.delete('/:id',authenticate,  authorize('super_admin', 'admin'), CustomOrderController.deleteOrder);

module.exports = router;



