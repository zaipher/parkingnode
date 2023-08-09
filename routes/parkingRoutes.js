const express = require('express');
const parkingsController = require('../controllers/parkingController');
const router = express.Router();

router.route('/')
    .get(parkingsController.getAllParkings)
    .post(parkingsController.addParking);

router.route('/:parkingId')
    .get(parkingsController.getParking)
    .patch(parkingsController.updateParking)
    .delete(parkingsController.deleteParking);

module.exports = router;