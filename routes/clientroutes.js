const express = require('express');
const clienntcontrollers=require('../controllers/clientcontrollers')
const multer=require('multer');
const {upload}=require('../middleware/imagemiddleware');

const router = express.Router();

router.get('/',clienntcontrollers.getClient);
router.post('/',upload.single('images'),clienntcontrollers.createClient);
router.put('/:id',upload.single('images'),clienntcontrollers.updateClient);
router.delete('/:id',clienntcontrollers.deleteClient);

module.exports=router;