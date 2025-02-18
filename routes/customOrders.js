const express = require('express');
const router = express.Router();
const CustomOrderController = require('../controllers/CustomOrderController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// router.post('/create', CustomOrderController.createOrder);
// router.get('/list', CustomOrderController.listOrders);
// router.get('/view/:id', CustomOrderController.viewOrder);
// router.delete('/delete/:id', CustomOrderController.deleteOrder);


router.post('/', upload.array('images', 5), CustomOrderController.createOrder);
router.get('/', CustomOrderController.listOrders);
router.delete('/:id', CustomOrderController.deleteOrder);

module.exports = router;



