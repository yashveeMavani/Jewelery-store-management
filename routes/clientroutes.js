const express = require('express');
const clientcontrollers=require('../controllers/clientcontrollers')
const multer=require('multer');
const {upload}=require('../middleware/imagemiddleware');
const { authenticate, authorize  } = require('../middleware/authmiddleware');

const router = express.Router();

router.get('/', authenticate, authorize('super_admin', 'admin', 'manager'), clientcontrollers.getClient); 
router.post('/', authenticate, authorize('super_admin', 'admin'), upload.single('images'), clientcontrollers.createClient); 
router.put('/:id', authenticate, authorize('super_admin', 'admin'), upload.single('images'), clientcontrollers.updateClient); 
router.delete('/:id', authenticate, authorize('super_admin'), clientcontrollers.deleteClient); 

module.exports=router;