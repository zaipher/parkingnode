const fs = require('fs');
const express = require('express');
const { getAllOwners, addOwner, getOwner, updateOwner, deleteOwner,checkRequiredParams } = require('../controllers/ownerController');
const router = express.Router();

router.route('/')
    .get(getAllOwners)
    .post(checkRequiredParams,addOwner);

router.route('/:ownerId')
    .get(getOwner)
    .patch(updateOwner)
    .delete(deleteOwner);

module.exports = router