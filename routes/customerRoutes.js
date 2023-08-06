const fs = require('fs');
const express = require('express');
const { getAllCustomers, addCustomer, getCustomer, updateCustomer, deleteCustomer } = require('../controllers/customerController');
const router = express.Router();

router.route('/')
    .get(getAllCustomers)
    .post(addCustomer);

router.route('/:customerId')
    .get(getCustomer)
    .patch(updateCustomer)
    .delete(deleteCustomer);

module.exports = router