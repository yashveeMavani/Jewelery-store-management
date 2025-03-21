const express = require('express');
const branchController = require('../controllers/BranchController');
const router = express.Router();


router.post('/', branchController.createBranch);
router.get('/', branchController.getBranches);
router.put('/:id',branchController. updateBranch);
router.delete('/:id', branchController.deleteBranch);

module.exports = router;
