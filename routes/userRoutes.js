const fs = require('fs');
const express = require('express');
const { getAllUsers, addUser, getUser, updateUser, deleteUser } = require('../controllers/userController');
const router = express.Router();

router.route('/')
    .get(getAllUsers)
    .post(addUser);

router.route('/:userId')
    .get(getUser)
    .patch(updateUser);
//     .delete(deleteUser);

module.exports = router