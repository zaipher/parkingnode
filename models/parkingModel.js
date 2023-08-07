const mongoose = require('mongoose');

const parkingSchema = new mongoose.Schema({
    parkingId: {type: String,unique: true},
    parkingSlot: {type: String,required: true},
    parkingGarage: { type: String,required: true},
    flatRate: {type: Number,required: true},
    succeedingHours: {type: Number,required: true},
    startDate: {type: Date},
    endDate: {type: Date},
    createdAt: {type: Date,default: Date.now},
    updatedAt: {type: Date,default: Date.now},
    status: String,
    parkingOwner: { type: String, required: true},
    driverName: {type: String,default: ""},
    plateNumber: {type: String,default: ""},
    phoneNumber: {type: String,default: ""}
  });

  const Parking = mongoose.model('Parking', parkingSchema); // create a new instance of the Parking Model ; model declaration
  module.exports = Parking;