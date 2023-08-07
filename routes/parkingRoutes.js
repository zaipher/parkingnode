const fs = require('fs');
const express = require('express');
const parkingsController = require('../controllers/parkingController');
const router = express.Router();

// router.checkRequiredKeys('parkingId', (req, res, next) =>{
//     console.log('Missing required parameters.');
//     next();
// });
//router.param('parkingId', parkingsController.checkparkingId);

router.route('/')
    .get(parkingsController.getAllParkings)
    .post(parkingsController.checkRequiredParams, parkingsController.addParking);

router.route('/:parkingId')
    .get(parkingsController.getParking)
    .patch(parkingsController.updateParking)
    .delete(parkingsController.deleteParking);

module.exports = router;