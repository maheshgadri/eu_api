const express = require('express');
const router = express.Router();
const { getUserById, updateUserById } = require('../controllers/userController');

router.get('/:id', getUserById);

// UPDATE USER PROFILE
router.put('/:id', updateUserById);

module.exports = router;
