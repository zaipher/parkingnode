const fs = require('fs');
const express = require('express');
const parkingSlotsController = require('../controllers/parkingSlotController');
const router = express.Router();

// router.checkRequiredKeys('parkingSlotId', (req, res, next) =>{
//     console.log('Missing required parameters.');
//     next();
// });

router.route('/')
    .get(parkingSlotsController.getAllParkingSlots)
    .post(parkingSlotsController.checkRequiredParams, parkingSlotsController.addParkingSlot);

router.route('/:parkingSlotId')
    .get(parkingSlotsController.getParkingSlot)
    .patch(parkingSlotsController.updateParkingSlot)
    .delete(parkingSlotsController.deleteParkingSlot);

module.exports = router;